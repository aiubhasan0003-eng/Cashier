import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

export const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  const income = transactions.filter(t => t.type === 'AY').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'BAY').reduce((sum, t) => sum + t.amount, 0);

  const data = [
    { name: 'Income (আয়)', value: income },
    { name: 'Expense (ব্যয়)', value: expense },
  ];

  const COLORS = ['#10b981', '#f43f5e']; // Emerald-500, Rose-500

  if (transactions.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value.toLocaleString()}৳`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};