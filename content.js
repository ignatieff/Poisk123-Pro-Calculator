document.addEventListener('DOMContentLoaded', initCalculator);
const observer = new MutationObserver(initCalculator);
observer.observe(document.body, { childList: true, subtree: true });

function initCalculator() {
  document.querySelectorAll('tr[itemtype="http://schema.org/Product"]').forEach(product => {
    if (product.querySelector('.repair-btn')) return;
    
    const buyCell = product.querySelector('.th-item-7');
    if (!buyCell) return;
    
    addCalculatorButton(buyCell, product);
  });
}

function addCalculatorButton(container, product) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'repair-buttons-container';
  
  // Переносим кнопку "В магазин" в наш контейнер
  const buyButton = container.querySelector('.buy-link');
  if (buyButton) {
    container.removeChild(buyButton);
    buttonsContainer.appendChild(buyButton);
  }
  
  // Создаем кнопку "Рассчитать ремонт" с инлайновыми стилями
  const btn = document.createElement('button');
  btn.className = 'repair-btn';
  btn.innerHTML = 'Цена ремонта';
  
  // Инлайновые стили как резерв
  btn.style.cssText = `
    -webkit-text-size-adjust: 100% !important;
    -webkit-font-smoothing: antialiased !important;
    margin: 5px 0 0 0 !important;
    line-height: normal !important;
    outline: none !important;
    transition: all .2s ease-out !important;
    font-size: 14px !important;
    border-radius: 3px !important;
    appearance: button !important;
    cursor: pointer !important;
    width: 100% !important;
    padding: 9px 15px !important;
    background: #5C6BC0 !important;
    color: #fff !important;
    border: none !important;
    font-family: 'ProximaNovaBold', Arial, sans-serif !important;
    text-decoration: none !important;
    display: block !important;
    box-sizing: border-box !important;
    text-align: center !important;
  `;
  
  btn.onclick = () => showComplexitySelector(btn, product);
  buttonsContainer.appendChild(btn);
  
  // Вставляем контейнер обратно
  container.appendChild(buttonsContainer);
}

function showComplexitySelector(btn, product) {
  btn.style.display = 'none';
  
  const selector = document.createElement('div');
  selector.className = 'complexity-selector';
  selector.innerHTML = `
    <div class="selector-title">Выберите сложность:</div>
    <div class="signal-levels">
      <div class="level-option" data-level="easy">
        <div class="signal-bars">
          <div class="bar filled"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <span>Лёгкий</span>
      </div>
      <div class="level-option" data-level="medium">
        <div class="signal-bars">
          <div class="bar filled"></div>
          <div class="bar filled"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <span>Средний</span>
      </div>
      <div class="level-option" data-level="hard">
        <div class="signal-bars">
          <div class="bar filled"></div>
          <div class="bar filled"></div>
          <div class="bar filled"></div>
          <div class="bar"></div>
        </div>
        <span>Сложный</span>
      </div>
      <div class="level-option" data-level="risky">
        <div class="signal-bars">
          <div class="bar filled"></div>
          <div class="bar filled"></div>
          <div class="bar filled"></div>
          <div class="bar filled"></div>
        </div>
        <span>Высокий риск</span>
      </div>
    </div>
  `;
  
  btn.parentNode.appendChild(selector);
  
  selector.querySelectorAll('.level-option').forEach(option => {
    option.addEventListener('click', () => {
      calculateRepair(product, option.dataset.level);
      selector.remove();
    });
  });
}

function calculateRepair(product, complexity) {
  const price = parseFloat(product.querySelector('[itemprop="price"]').textContent);
  
  chrome.storage.sync.get({
    deliveryCost: 300,
    otherExpenses: 0,
    easyPrice: 500,
    mediumPrice: 1000,
    hardPrice: 2000,
    riskyPrice: 3500
  }, (settings) => {
    const workPrices = {
      easy: settings.easyPrice,
      medium: settings.mediumPrice,
      hard: settings.hardPrice,
      risky: settings.riskyPrice
    };
    
    const total = Math.round(price + settings.deliveryCost + settings.otherExpenses + workPrices[complexity]);
    
    showResult(product, {
      parts: price,
      delivery: settings.deliveryCost,
      expenses: settings.otherExpenses,
      work: workPrices[complexity],
      total: total,
      complexity: complexity
    });
  });
}

function showResult(product, data) {
  const complexityNames = {
    easy: "Лёгкий ремонт",
    medium: "Средний ремонт",
    hard: "Сложный ремонт",
    risky: "Высокий риск"
  };
  
  const result = document.createElement('div');
  result.className = 'repair-result';
  result.innerHTML = `
    <div class="result-header">
      <span class="complexity-badge ${data.complexity}">${complexityNames[data.complexity]}</span>
      <span class="total-price">${data.total} ₽</span>
    </div>
    <div class="result-details">
      <div>Запчасть: <b>${data.parts} ₽</b></div>
      <div>Доставка: <b>${data.delivery} ₽</b></div>
      <div>Расходы: <b>${data.expenses} ₽</b></div>
      <div>Работа: <b>${data.work} ₽</b></div>
    </div>
  `;
  
  product.querySelector('[itemprop="price"]').parentNode.appendChild(result);
}