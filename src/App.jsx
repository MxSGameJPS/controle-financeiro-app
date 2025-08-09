import React, { useState, useEffect } from "react";
import {
  Home,
  PieChart,
  CreditCard,
  ShoppingCart,
  Target,
  Wallet,
} from "lucide-react";
import Welcome from "./components/Welcome.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Transactions from "./components/Transactions.jsx";
import ShoppingList from "./components/ShoppingList.jsx";
import Goals from "./components/Goals.jsx";
import Wallets from "./components/Wallets.jsx";
import CategoriesManager from "./components/CategoriesManager.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [wallets, setWallets] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Tenta carregar preferência do localStorage
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const menuItems = [
    {
      id: "welcome",
      label: "Seja Bem-Vindo",
      icon: Home,
      component: Welcome,
    },
    {
      id: "dashboard",
      label: "Painel Principal",
      icon: PieChart,
      component: Dashboard,
    },
    {
      id: "wallets",
      label: "Carteiras",
      icon: Wallet,
      component: () => (
        <Wallets
          wallets={wallets}
          onAddWallet={(wallet) => setWallets([...wallets, wallet])}
          onEditWallet={(idx) => {
            const name = prompt("Novo nome da carteira:", wallets[idx].name);
            if (name && name.trim()) {
              setWallets((wallets) =>
                wallets.map((w, i) => (i === idx ? { ...w, name } : w))
              );
            }
          }}
          onDeleteWallet={(idx) => {
            if (window.confirm("Deseja realmente excluir esta carteira?")) {
              setWallets((wallets) => wallets.filter((_, i) => i !== idx));
            }
          }}
        />
      ),
    },
    {
      id: "transactions",
      label: "Transações",
      icon: CreditCard,
      component: () => <Transactions wallets={wallets} />,
    },
    {
      id: "shopping",
      label: "Lista de Compras",
      icon: ShoppingCart,
      component: ShoppingList,
    },
    { id: "goals", label: "Metas Financeiras", icon: Target, component: Goals },
    {
      id: "categories",
      label: "Categorias",
      icon: PieChart,
      component: CategoriesManager,
    },
  ];

  const ActiveComponent =
    menuItems.find((item) => item.id === activeTab)?.component || Dashboard;

  return (
    <div
      className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between p-6">
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Controle Financeiro
          </h1>
          <button
            onClick={() => setDarkMode((dm) => !dm)}
            className={`ml-2 px-2 py-1 rounded ${
              darkMode
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-200 text-gray-800"
            }`}
            title={darkMode ? "Modo claro" : "Modo escuro"}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } ${
                  activeTab === item.id
                    ? `${
                        darkMode
                          ? "bg-blue-900 border-r-2 border-blue-400 text-blue-200"
                          : "bg-blue-50 border-r-2 border-blue-500 text-blue-600"
                      }`
                    : `${darkMode ? "text-gray-300" : "text-gray-600"}`
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className={`p-8 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
