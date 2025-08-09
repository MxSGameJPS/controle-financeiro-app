import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useShoppingList } from '../hooks/useDataPersistence';

function ShoppingList() {
  const { data: items, setData: setItems, loading } = useShoppingList();
  const [newItem, setNewItem] = useState('');

  // Função para adicionar novo item
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.trim() === '') {
      alert('Por favor, digite o nome do item.');
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.trim(),
      completed: false
    };

    await setItems([...items, item]);
    setNewItem('');
  };

  // Função para marcar/desmarcar item como comprado
  const toggleItem = async (id) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await setItems(updatedItems);
  };

  // Função para remover item individual
  const removeItem = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    await setItems(updatedItems);
  };

  // Função para limpar todos os itens marcados
  const clearCompleted = async () => {
    const completedCount = items.filter(item => item.completed).length;
    if (completedCount === 0) {
      alert('Não há itens marcados para remover.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja remover ${completedCount} item(s) marcado(s)?`)) {
      const updatedItems = items.filter(item => !item.completed);
      await setItems(updatedItems);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando lista de compras...</div>
      </div>
    );
  }

  // Separar itens pendentes e concluídos
  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
        <div className="text-sm text-gray-600">
          {pendingItems.length} pendente(s) • {completedItems.length} concluído(s)
        </div>
      </div>

      {/* Formulário para adicionar novo item */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={addItem} className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Digite o nome do item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </form>
      </div>

      {/* Lista de itens pendentes */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Itens Pendentes</h3>
          </div>
          <div className="p-4 space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {item.completed && (
                      <Check className="w-3 h-3 text-blue-600" />
                    )}
                  </button>
                  <span className="text-gray-900">{item.name}</span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de itens concluídos */}
      {completedItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Itens Concluídos</h3>
            <button
              onClick={clearCompleted}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Concluídos
            </button>
          </div>
          <div className="p-4 space-y-3">
            {completedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-5 h-5 bg-green-500 border-2 border-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </button>
                  <span className="text-gray-600 line-through">{item.name}</span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há itens */}
      {items.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lista vazia</h3>
          <p className="text-gray-600">Adicione itens à sua lista de compras usando o formulário acima.</p>
        </div>
      )}

      {/* Estatísticas */}
      {items.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{items.length}</div>
              <div className="text-sm text-gray-600">Total de Itens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingItems.length}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedItems.length}</div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </div>
          </div>
          {items.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{Math.round((completedItems.length / items.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedItems.length / items.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShoppingList;

