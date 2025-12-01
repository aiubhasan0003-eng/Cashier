import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransactionType, CategoryItem } from '../types';

interface TransactionFormProps {
  onAdd: (title: string, amount: number, type: TransactionType, category: string) => void;
  categories: CategoryItem[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, categories }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('AY');
  const [category, setCategory] = useState('');

  // Filter categories based on selected type
  const availableCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    // Default category if none selected
    const finalCategory = category || (availableCategories[0]?.name || 'Other');

    onAdd(title, parseFloat(amount), type, finalCategory);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Entry</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Description (e.g. Salary, Rent)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            />
          </div>
          
          <div className="w-full md:w-32">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
             <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as TransactionType);
                setCategory(''); // Reset category when type changes
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="AY">Income (আয়)</option>
              <option value="BAY">Expense (ব্যয়)</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Category</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Add</span>
          </button>
        </div>
      </form>
    </div>
  );
};