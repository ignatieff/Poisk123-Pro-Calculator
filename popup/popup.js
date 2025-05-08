document.addEventListener('DOMContentLoaded', () => {
  // Загрузка сохраненных настроек
  chrome.storage.sync.get({
    deliveryCost: 300,
    otherExpenses: 0,
    easyPrice: 500,
    mediumPrice: 1000,
    hardPrice: 2000,
    riskyPrice: 3500
  }, (settings) => {
    document.getElementById('delivery').value = settings.deliveryCost;
    document.getElementById('expenses').value = settings.otherExpenses;
    document.getElementById('easy').value = settings.easyPrice;
    document.getElementById('medium').value = settings.mediumPrice;
    document.getElementById('hard').value = settings.hardPrice;
    document.getElementById('risky').value = settings.riskyPrice;
  });

  // Сохранение настроек
  document.getElementById('save-btn').addEventListener('click', () => {
    const settings = {
      deliveryCost: parseInt(document.getElementById('delivery').value) || 0,
      otherExpenses: parseInt(document.getElementById('expenses').value) || 0,
      easyPrice: parseInt(document.getElementById('easy').value) || 0,
      mediumPrice: parseInt(document.getElementById('medium').value) || 0,
      hardPrice: parseInt(document.getElementById('hard').value) || 0,
      riskyPrice: parseInt(document.getElementById('risky').value) || 0
    };
    
    chrome.storage.sync.set(settings, () => {
      alert('Настройки сохранены!');
      window.close();
    });
  });
});