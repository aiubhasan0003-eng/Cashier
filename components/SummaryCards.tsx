import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { FinancialSummary } from '../types';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Income (আয়)</p>
          <p className="text-2xl font-bold text-emerald-600">{summary.totalIncome.toLocaleString()}৳</p>
        </div>
        <div className="bg-emerald-100 p-3 rounded-full">
          <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Expense (ব্যয়)</p>
          <p className="text-2xl font-bold text-rose-600">{summary.totalExpense.toLocaleString()}৳</p>
        </div>
        <div className="bg-rose-100 p-3 rounded-full">
          <ArrowDownCircle className="w-6 h-6 text-rose-600" />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">Net Balance</p>
          <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
            {summary.balance.toLocaleString()}৳
          </p>
        </div>
        <div className={`p-3 rounded-full ${summary.balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
          <Wallet className={`w-6 h-6 ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-500'}`} />
        </div>
      </div>
    </div>
  );
};