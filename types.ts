export type TransactionType = 'AY' | 'BAY';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food (খাবার)',
  'Transport (যাতায়াত)',
  'Utilities (বিল)',
  'Health (স্বাস্থ্য)',
  'Education (শিক্ষা)',
  'Shopping (কেনাকাটা)',
  'Entertainment (বিনোদন)',
  'Other (অন্যান্য)'
];

export const DEFAULT_INCOME_CATEGORIES = [
  'Salary (বেতন)',
  'Business (ব্যবসা)',
  'Gift (উপহার)',
  'Other (অন্যান্য)'
];