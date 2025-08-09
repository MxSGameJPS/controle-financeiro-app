import React, { useState } from "react";

function Wallets({ wallets, onAddWallet, onEditWallet, onDeleteWallet }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Bancos");
  // ...future: edit state

  const handleAdd = () => {
    if (name.trim()) {
      onAddWallet({ name, type, balance: 0 });
      setName("");
      setType("Bancos");
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Carteiras</h2>
      <form
        className="grid items-center grid-cols-12 gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          placeholder="Nome da carteira"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-5 px-3 py-2 border rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded"
        >
          <option value="Bancos">Banco</option>
          <option value="Carteira pessoal">Carteira Pessoal</option>
          <option value="Criptomoedas">Criptomoedas</option>
          <option value="Outro">Outro</option>
        </select>
        <button
          type="submit"
          className="col-span-3 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Adicionar
        </button>
      </form>
      <ul className="divide-y divide-gray-200">
        {wallets.map((wallet, idx) => (
          <li key={idx} className="flex items-center justify-between py-2">
            <span>
              <span className="font-semibold">{wallet.name}</span>{" "}
              <span className="text-xs text-gray-500">({wallet.type})</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-blue-700">
                R$ {wallet.balance.toFixed(2)}
              </span>
              <button
                title="Editar"
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => onEditWallet && onEditWallet(idx)}
              >
                Editar
              </button>
              <button
                title="Excluir"
                className="px-2 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200"
                onClick={() => onDeleteWallet && onDeleteWallet(idx)}
              >
                Excluir
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wallets;
