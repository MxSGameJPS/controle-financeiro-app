const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  transactionManager,
  shoppingListManager,
  goalsManager,
  categoriesManager,
  backupData,
  restoreData,
  DATA_DIR,
} = require("./src/utils/dataManager");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "assets/icon.png"), // Opcional: adicionar ícone
  });

  win.loadFile(path.resolve(__dirname, "dist/index.html"));

  // Remover barra de menu nativa
  win.setMenu(null);

  // DevTools desativado para produção
}

// Handlers IPC para comunicação com o processo renderer
ipcMain.handle("load-transactions", async () => {
  return transactionManager.load();
});

ipcMain.handle("save-transactions", async (event, transactions) => {
  return transactionManager.save(transactions);
});

ipcMain.handle("load-shopping-list", async () => {
  return shoppingListManager.load();
});

ipcMain.handle("save-shopping-list", async (event, items) => {
  return shoppingListManager.save(items);
});

ipcMain.handle("load-goals", async () => {
  return goalsManager.load();
});

ipcMain.handle("save-goals", async (event, goals) => {
  return goalsManager.save(goals);
});

ipcMain.handle("load-categories", async () => {
  return categoriesManager.load();
});

ipcMain.handle("save-categories", async (event, categories) => {
  return categoriesManager.save(categories);
});

ipcMain.handle("backup-data", async () => {
  return backupData();
});

ipcMain.handle("restore-data", async (event, filePath) => {
  return restoreData(filePath);
});

ipcMain.handle("get-data-path", async () => {
  return DATA_DIR;
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Salvar dados automaticamente antes de fechar o aplicativo
app.on("before-quit", () => {
  // Os dados já são salvos automaticamente pelos componentes
  console.log("Aplicativo sendo fechado...");
});
