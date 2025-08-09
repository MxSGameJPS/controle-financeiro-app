import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useCategories } from "../hooks/useDataPersistence";

function CategoriesManager() {
  const { data: categories, setData: setCategories, loading } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      alert("Categoria já existe!");
      return;
    }
    await setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleEdit = async (idx) => {
    if (!editingValue.trim()) return;
    const updated = categories.map((cat, i) =>
      i === idx ? editingValue.trim() : cat
    );
    await setCategories(updated);
    setEditingIdx(null);
    setEditingValue("");
  };

  const handleDelete = async (idx) => {
    if (window.confirm("Deseja excluir esta categoria?")) {
      await setCategories(categories.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Categorias</h2>
      <form className="flex gap-2 mb-4" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nova categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </form>
      <ul className="divide-y divide-gray-200">
        {categories.map((cat, idx) => (
          <li key={idx} className="py-2 flex justify-between items-center">
            {editingIdx === idx ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="border rounded px-2 py-1 flex-1 mr-2"
                />
                <button
                  className="text-green-600 px-2"
                  onClick={() => handleEdit(idx)}
                >
                  Salvar
                </button>
                <button
                  className="text-gray-600 px-2"
                  onClick={() => setEditingIdx(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800">{cat}</span>
                <span className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setEditingIdx(idx);
                      setEditingValue(cat);
                    }}
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(idx)}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesManager;
