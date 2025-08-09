const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o processo renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Transações
  loadTransactions: () => ipcRenderer.invoke('load-transactions'),
  saveTransactions: (transactions) => ipcRenderer.invoke('save-transactions', transactions),
  
  // Lista de Compras
  loadShoppingList: () => ipcRenderer.invoke('load-shopping-list'),
  saveShoppingList: (items) => ipcRenderer.invoke('save-shopping-list', items),
  
  // Metas Financeiras
  loadGoals: () => ipcRenderer.invoke('load-goals'),
  saveGoals: (goals) => ipcRenderer.invoke('save-goals', goals),
  
  // Categorias
  loadCategories: () => ipcRenderer.invoke('load-categories'),
  saveCategories: (categories) => ipcRenderer.invoke('save-categories', categories),
  
  // Backup e Restauração
  backupData: () => ipcRenderer.invoke('backup-data'),
  restoreData: (filePath) => ipcRenderer.invoke('restore-data', filePath),
  
  // Utilitários
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
});

