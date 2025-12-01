import React, { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { CategoryItem, TransactionType } from '../types';

interface CategoryManagerProps {
  categories: CategoryItem[];
  onAdd: (name: string, type: TransactionType) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onAdd, 
  onDelete,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('BAY');
  const [newCategory, setNewCategory] = useState('');

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    onAdd(newCategory.trim(), activeTab);
    setNewCategory('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Manage Categories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('AY')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'AY' 
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Income (আয়)
          </button>
          <button
            onClick={() => setActiveTab('BAY')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'BAY' 
                ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expense (ব্যয়)
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder={`New ${activeTab === 'AY' ? 'Income' : 'Expense'} Category Name`}
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {filteredCategories.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No categories found.</p>
            ) : (
              filteredCategories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};