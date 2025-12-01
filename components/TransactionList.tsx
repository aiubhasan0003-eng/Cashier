import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-400">
        <p>No transactions yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((t) => (
          <div key={t.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className={`p-2 rounded-lg shrink-0 ${t.type === 'AY' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {t.type === 'AY' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{t.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Tag size={10} />
                    {t.category || 'Other'}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-4 shrink-0">
              <span className={`font-semibold whitespace-nowrap ${t.type === 'AY' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === 'AY' ? '+' : '-'}{t.amount.toLocaleString()}৳
              </span>
              <button
                onClick={() => onDelete(t.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete transaction"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};