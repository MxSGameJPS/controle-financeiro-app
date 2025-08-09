const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// Caminho para o diretório de dados do usuário
const getUserDataPath = () => {
  try {
    return app.getPath("userData");
  } catch (error) {
    // Fallback para desenvolvimento
    return path.join(__dirname, "../../data");
  }
};

const DATA_DIR = getUserDataPath();
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json");
const SHOPPING_LIST_FILE = path.join(DATA_DIR, "shopping-list.json");
const GOALS_FILE = path.join(DATA_DIR, "goals.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

// Garantir que o diretório de dados existe
const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Função genérica para ler dados de um arquivo JSON
const readJsonFile = (filePath, defaultData = []) => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return defaultData;
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return defaultData;
  }
};

// Função genérica para escrever dados em um arquivo JSON
const writeJsonFile = (filePath, data) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error);
    return false;
  }
};

// Gerenciamento de Transações
const transactionManager = {
  load: () => {
    return readJsonFile(TRANSACTIONS_FILE, []);
  },

  save: (transactions) => {
    return writeJsonFile(TRANSACTIONS_FILE, transactions);
  },
};

// Gerenciamento de Lista de Compras
const shoppingListManager = {
  load: () => {
    return readJsonFile(SHOPPING_LIST_FILE, []);
  },

  save: (items) => {
    return writeJsonFile(SHOPPING_LIST_FILE, items);
  },
};

// Gerenciamento de Metas Financeiras
const goalsManager = {
  load: () => {
    return readJsonFile(GOALS_FILE, []);
  },

  save: (goals) => {
    return writeJsonFile(GOALS_FILE, goals);
  },
};

// Gerenciamento de Categorias
const categoriesManager = {
  load: () => {
    return readJsonFile(CATEGORIES_FILE, []);
  },

  save: (categories) => {
    return writeJsonFile(CATEGORIES_FILE, categories);
  },
};

// Função para fazer backup de todos os dados
const backupData = () => {
  try {
    const backupDir = path.join(DATA_DIR, "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    const allData = {
      transactions: transactionManager.load(),
      shoppingList: shoppingListManager.load(),
      goals: goalsManager.load(),
      categories: categoriesManager.load(),
      backupDate: new Date().toISOString(),
    };

    return writeJsonFile(backupFile, allData);
  } catch (error) {
    console.error("Erro ao fazer backup:", error);
    return false;
  }
};

// Função para restaurar dados de um backup
const restoreData = (backupFilePath) => {
  try {
    const backupData = readJsonFile(backupFilePath);

    if (backupData.transactions) {
      transactionManager.save(backupData.transactions);
    }
    if (backupData.shoppingList) {
      shoppingListManager.save(backupData.shoppingList);
    }
    if (backupData.goals) {
      goalsManager.save(backupData.goals);
    }
    if (backupData.categories) {
      categoriesManager.save(backupData.categories);
    }

    return true;
  } catch (error) {
    console.error("Erro ao restaurar backup:", error);
    return false;
  }
};

module.exports = {
  transactionManager,
  shoppingListManager,
  goalsManager,
  categoriesManager,
  backupData,
  restoreData,
  DATA_DIR,
};
