import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ShoppingCart,
} from "lucide-react";
import {
  useTransactions,
  useShoppingList,
  useGoals,
} from "../hooks/useDataPersistence";

function Dashboard() {
  const { data: transactions, loading } = useTransactions();
  const { data: shoppingList, loading: shoppingLoading } = useShoppingList();
  const { data: goals, loading: goalsLoading } = useGoals();

  // Buscar carteiras do localStorage
  const [wallets, setWallets] = React.useState([]);
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("wallets");
      if (stored) {
        setWallets(JSON.parse(stored));
      }
    } catch (e) {
      setWallets([]);
    }
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcular dados do dashboard baseado nas transações reais
  const calculateDashboardData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const monthlyIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = monthlyIncome - monthlyExpenses;

    // Agrupar despesas por categoria
    const expensesByCategory = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const expenseCategoriesArray = Object.entries(expensesByCategory)
      .map(([category, amount], index) => ({
        category,
        amount,
        color: [
          "bg-red-500",
          "bg-blue-500",
          "bg-green-500",
          "bg-yellow-500",
          "bg-purple-500",
          "bg-pink-500",
        ][index % 6],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Mostrar apenas as 6 principais categorias

    // Últimas 5 transações
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Resumo por carteira
    const walletsSummary = wallets.map((wallet) => {
      const walletTransactions = currentMonthTransactions.filter(
        (t) => t.wallet === wallet.name
      );
      const income = walletTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = walletTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: wallet.name,
        type: wallet.type,
        income,
        expense,
        balance: income - expense,
      };
    });

    return {
      balance,
      monthlyIncome,
      monthlyExpenses,
      expensesByCategory: expenseCategoriesArray,
      recentTransactions,
      walletsSummary,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando dashboard...</div>
      </div>
    );
  }

  const dashboardData = calculateDashboardData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel Principal</h2>
      {/* Metas Financeiras */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <span className="mr-2 text-lg">🎯</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Metas Financeiras
          </h3>
        </div>
        {goalsLoading ? (
          <div className="text-gray-500">Carregando metas...</div>
        ) : goals.length > 0 ? (
          <ul className="space-y-3">
            {goals.map((goal) => {
              const percent = Math.min(
                100,
                (goal.currentAmount / goal.targetAmount) * 100
              );
              return (
                <li key={goal.id} className="p-3 rounded bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-700">{goal.name}</span>
                    <span className="text-xs text-gray-500">
                      Meta: {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full h-3 mb-2 bg-gray-200 rounded-full">
                    <div
                      className="h-3 bg-green-500 rounded-full"
                      style={{ width: percent + "%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progresso: {formatCurrency(goal.currentAmount)}</span>
                    <span>{percent.toFixed(1)}%</span>
                  </div>
                  {goal.currentAmount >= goal.targetAmount && (
                    <div className="mt-2 font-semibold text-green-600">
                      Meta atingida! 🎉
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-gray-500">Nenhuma meta cadastrada.</div>
        )}
      </div>

      {/* Cards de Resumo */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Itens Pendentes na Lista de Compras
          </h3>
        </div>
        {shoppingLoading ? (
          <div className="text-gray-500">Carregando...</div>
        ) : (
          <div>
            {shoppingList.filter((item) => !item.completed).length > 0 ? (
              <ul className="space-y-2">
                {shoppingList
                  .filter((item) => !item.completed)
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded bg-gray-50"
                    >
                      <span className="text-gray-900">{item.name}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="text-gray-500">Nenhum item pendente.</div>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Saldo Atual */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo do Mês</p>
              <p
                className={`text-2xl font-bold ${
                  dashboardData.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(dashboardData.balance)}
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                dashboardData.balance >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <DollarSign
                className={`w-6 h-6 ${
                  dashboardData.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Receitas do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Receitas do Mês
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.monthlyIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Despesas do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Despesas do Mês
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData.monthlyExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo por Carteira */}
      {dashboardData.walletsSummary.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Resumo por Carteira
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboardData.walletsSummary.map((wallet, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700">{wallet.name}</span>
                  <span className="text-xs text-gray-500">{wallet.type}</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="block text-xs text-gray-600">
                      Receitas
                    </span>
                    <span className="block font-bold text-green-600">
                      {formatCurrency(wallet.income)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-600">
                      Despesas
                    </span>
                    <span className="block font-bold text-red-600">
                      {formatCurrency(wallet.expense)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-600">Saldo</span>
                    <span
                      className={`block font-bold ${
                        wallet.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(wallet.balance)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de Despesas por Categoria */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Despesas por Categoria
            </h3>
          </div>
          {dashboardData.expensesByCategory.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.expensesByCategory.map((item, index) => {
                const percentage =
                  dashboardData.monthlyExpenses > 0
                    ? (item.amount / dashboardData.monthlyExpenses) * 100
                    : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded ${item.color} mr-3`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Nenhuma despesa registrada este mês</p>
            </div>
          )}
        </div>

        {/* Últimas Transações */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Últimas Transações
          </h3>
          {dashboardData.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")} •{" "}
                      {transaction.category}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Nenhuma transação registrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumo Estatístico */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Resumo Estatístico
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-600">Total de Transações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.type === "income").length}
            </div>
            <div className="text-sm text-gray-600">Receitas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {transactions.filter((t) => t.type === "expense").length}
            </div>
            <div className="text-sm text-gray-600">Despesas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(transactions.map((t) => t.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categorias</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
