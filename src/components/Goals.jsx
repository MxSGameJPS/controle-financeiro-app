import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Target, TrendingUp } from 'lucide-react';
import { useGoals } from '../hooks/useDataPersistence';

function Goals() {
  const { data: goals, setData: setGoals, loading } = useGoals();

  // Estado para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: ''
  });

  // Estado para o modal de atualização de valor
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [updateAmount, setUpdateAmount] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      id: editingGoal ? editingGoal.id : Date.now(),
      createdDate: editingGoal ? editingGoal.createdDate : new Date().toISOString().split('T')[0]
    };

    let updatedGoals;
    if (editingGoal) {
      updatedGoals = goals.map(g => g.id === editingGoal.id ? goalData : g);
    } else {
      updatedGoals = [...goals, goalData];
    }

    await setGoals(updatedGoals);

    // Resetar formulário e fechar modal
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: ''
    });
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      const updatedGoals = goals.filter(g => g.id !== id);
      await setGoals(updatedGoals);
    }
  };

  const openModal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: ''
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (goal) => {
    setUpdatingGoal(goal);
    setUpdateAmount('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateAmount = async (e) => {
    e.preventDefault();
    
    if (!updateAmount || parseFloat(updateAmount) <= 0) {
      alert('Por favor, digite um valor válido.');
      return;
    }

    const newAmount = updatingGoal.currentAmount + parseFloat(updateAmount);
    
    const updatedGoals = goals.map(g => 
      g.id === updatingGoal.id 
        ? { ...g, currentAmount: Math.min(newAmount, g.targetAmount) }
        : g
    );

    await setGoals(updatedGoals);

    setIsUpdateModalOpen(false);
    setUpdatingGoal(null);
    setUpdateAmount('');
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando metas financeiras...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Metas Financeiras</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Grid de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
          const isCompleted = progressPercentage >= 100;
          
          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <Target className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    {isCompleted && (
                      <span className="text-sm text-green-600 font-medium">✓ Meta Atingida!</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progressPercentage)}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Atual</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Meta</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Faltam: {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                  </p>
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => openUpdateModal(goal)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Adicionar Valor
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há metas */}
      {goals.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-400 mb-4">
            <Target className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta definida</h3>
          <p className="text-gray-600 mb-4">Comece definindo suas metas financeiras para acompanhar seu progresso.</p>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Criar Primeira Meta
          </button>
        </div>
      )}

      {/* Modal para Adicionar/Editar Meta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome da Meta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Meta *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Viagem de Férias"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Valor Alvo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Alvo *
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Valor Atual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Atual
                </label>
                <input
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingGoal ? 'Atualizar' : 'Criar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Atualizar Valor */}
      {isUpdateModalOpen && updatingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Adicionar Valor - {updatingGoal.name}
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Valor Atual:</span>
                <span className="font-medium">{formatCurrency(updatingGoal.currentAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Meta:</span>
                <span className="font-medium">{formatCurrency(updatingGoal.targetAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Restante:</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(updatingGoal.targetAmount - updatingGoal.currentAmount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateAmount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor a Adicionar *
                </label>
                <input
                  type="number"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;

