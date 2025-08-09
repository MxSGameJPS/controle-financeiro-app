import { useState, useEffect, useCallback } from "react";

// Hook personalizado para gerenciar persistência de dados
export const useDataPersistence = (dataType, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapear tipos de dados para métodos da API
  const apiMethods = {
    transactions: {
      load: "loadTransactions",
      save: "saveTransactions",
    },
    shoppingList: {
      load: "loadShoppingList",
      save: "saveShoppingList",
    },
    goals: {
      load: "loadGoals",
      save: "saveGoals",
    },
    categories: {
      load: "loadCategories",
      save: "saveCategories",
    },
  };

  // Carregar dados na inicialização
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se a API do Electron está disponível
        if (window.electronAPI && apiMethods[dataType]) {
          const loadedData = await window.electronAPI[
            apiMethods[dataType].load
          ]();
          setData(loadedData || initialData);
        } else {
          // Fallback para dados iniciais se a API não estiver disponível (desenvolvimento)
          setData(initialData);
        }
      } catch (err) {
        console.error(`Erro ao carregar ${dataType}:`, err);
        setError(err.message);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataType]);

  // Função para salvar dados
  const saveData = useCallback(
    async (newData) => {
      try {
        setError(null);

        // Verificar se a API do Electron está disponível
        if (window.electronAPI && apiMethods[dataType]) {
          const success = await window.electronAPI[apiMethods[dataType].save](
            newData
          );
          if (success) {
            setData(newData);
            return true;
          } else {
            throw new Error("Falha ao salvar dados");
          }
        } else {
          // Fallback para desenvolvimento - apenas atualizar estado
          setData(newData);
          return true;
        }
      } catch (err) {
        console.error(`Erro ao salvar ${dataType}:`, err);
        setError(err.message);
        return false;
      }
    },
    [dataType]
  );

  // Função para atualizar dados e salvar automaticamente
  const updateData = useCallback(
    async (updater) => {
      const newData = typeof updater === "function" ? updater(data) : updater;
      return await saveData(newData);
    },
    [data, saveData]
  );

  return {
    data,
    setData: updateData,
    loading,
    error,
    saveData,
  };
};

// Hook específico para transações
export const useTransactions = () => {
  return useDataPersistence("transactions", []);
};

// Hook específico para lista de compras
export const useShoppingList = () => {
  return useDataPersistence("shoppingList", []);
};

// Hook específico para metas financeiras
export const useGoals = () => {
  return useDataPersistence("goals", []);
};

// Hook específico para categorias
export const useCategories = () => {
  return useDataPersistence("categories", []);
};
