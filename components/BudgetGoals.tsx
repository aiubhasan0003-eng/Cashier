import React, { useState } from 'react';
import { Target, Save, Trash2 } from 'lucide-react';
import { Budget, Transaction, CategoryItem } from '../types';

interface BudgetGoalsProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: CategoryItem[];
  onSaveBudget: (category: string, limit: number) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetGoals: React.FC<BudgetGoalsProps> = ({ 
  budgets, 
  transactions, 
  categories,
  onSaveBudget,
  onDeleteBudget 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limit, setLimit] = useState('');

  // Only show Expense categories
  const expenseCategories = categories.filter(c => c.type === 'BAY');

  // Set initial selected category when categories load
  React.useEffect(() => {
    if (!selectedCategory && expenseCategories.length > 0) {
      setSelectedCategory(expenseCategories[0].name);
    }
  }, [expenseCategories, selectedCategory]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || !selectedCategory) return;
    onSaveBudget(selectedCategory, parseFloat(limit));
    setLimit('');
  };

  const calculateSpent = (category: string) => {
    return transactions
      .filter(t => t.type === 'BAY' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <Target className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Monthly Budget Goals (বাজেট লক্ষ্যমাত্রা)</h3>
      </div>

      <div className="p-6">
        {/* Add Budget Form */}
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 mb-8 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
               {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Limit (৳)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Set Budget
          </button>
        </form>

        {/* Budget List */}
        <div className="space-y-6">
          {budgets.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No budgets set yet. Set a goal above!</p>
          ) : (
            budgets.map(budget => {
              const spent = calculateSpent(budget.category);
              const percentage = Math.min((spent / budget.limit) * 100, 100);
              const isOverBudget = spent > budget.limit;
              
              let progressColor = 'bg-emerald-500';
              if (percentage > 80) progressColor = 'bg-yellow-500';
              if (isOverBudget) progressColor = 'bg-rose-500';

              return (
                <div key={budget.id} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{budget.category}</h4>
                      {isOverBudget && (
                        <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">Over Budget!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-sm text-gray-500">
                        <span className={`font-semibold ${isOverBudget ? 'text-rose-600' : 'text-gray-700'}`}>
                          {spent.toLocaleString()}৳
                        </span> 
                        / {budget.limit.toLocaleString()}৳
                      </span>
                      <button 
                        onClick={() => onDeleteBudget(budget.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};