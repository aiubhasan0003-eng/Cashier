import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, FinancialSummary, Budget, CategoryItem } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Charts } from './components/Charts';
import { AIAdvisor } from './components/AIAdvisor';
import { BudgetGoals } from './components/BudgetGoals';
import { DateFilter } from './components/DateFilter';
import { Login } from './components/Login';
import { CategoryManager } from './components/CategoryManager';
import { NotificationToast, NotificationType } from './components/NotificationToast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Wallet, LogOut, Settings } from 'lucide-react';
import { 
  subscribeToTransactions, 
  addTransaction, 
  deleteTransaction,
  subscribeToBudgets,
  saveBudget,
  deleteBudget,
  subscribeToCategories,
  addCategory,
  deleteCategory
} from './services/transactionService';
import { db, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

interface DashboardProps {
  isGuest: boolean;
  guestName?: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isGuest, guestName, onLogout }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  
  // Notification State
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);
  
  // UI State
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  // Date Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Determine User ID (null for guest)
  const userId = isGuest ? null : currentUser?.uid || null;

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  // Subscribe to data updates (Firebase or Local Storage) on mount
  useEffect(() => {
    let unsubscribeTx: () => void;
    let unsubscribeBudgets: () => void;
    let unsubscribeCategories: () => void;
    
    try {
      unsubscribeTx = subscribeToTransactions(
        userId,
        (data) => {
          setTransactions(data);
        },
        (err) => {
          console.error("Subscription error:", err);
          if (!isGuest) {
            showNotification('error', "Failed to connect to the database.");
          }
        }
      );

      unsubscribeBudgets = subscribeToBudgets(userId, (data) => {
        setBudgets(data);
      });

      unsubscribeCategories = subscribeToCategories(userId, (data) => {
        setCategories(data);
      });

    } catch (err) {
      console.error("Init error:", err);
      showNotification('error', "Failed to initialize data connection.");
    }

    return () => {
      if (unsubscribeTx) unsubscribeTx();
      if (unsubscribeBudgets) unsubscribeBudgets();
      if (unsubscribeCategories) unsubscribeCategories();
    };
  }, [userId, isGuest]);

  // Compute filtered transactions based on date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = new Date(t.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) {
        start.setHours(0, 0, 0, 0);
        if (txDate < start) return false;
      }
      if (end) {
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
      return true;
    });
  }, [transactions, startDate, endDate]);

  // Derive summary from filtered transactions
  const summary: FinancialSummary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'AY')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'BAY')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [filteredTransactions]);

  const handleAddTransaction = async (title: string, amount: number, type: TransactionType, category: string) => {
    try {
      await addTransaction(userId, title, amount, type, category);
      showNotification('success', 'Transaction added successfully! (লেনদেন যোগ করা হয়েছে)');
    } catch (e) {
      console.error("Error adding transaction", e);
      showNotification('error', "Could not add transaction. Please try again.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(userId, id);
      showNotification('success', 'Transaction deleted! (লেনদেন মুছে ফেলা হয়েছে)');
    } catch (e) {
      console.error("Error deleting transaction", e);
      showNotification('error', "Could not delete transaction.");
    }
  };

  const handleSaveBudget = async (category: string, limit: number) => {
    try {
      await saveBudget(userId, category, limit);
      showNotification('success', 'Budget goal set! (বাজেট লক্ষ্য নির্ধারণ করা হয়েছে)');
    } catch (e) {
      console.error("Error saving budget", e);
      showNotification('error', "Could not save budget.");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(userId, id);
      showNotification('success', 'Budget goal removed! (বাজেট লক্ষ্য মুছে ফেলা হয়েছে)');
    } catch (e) {
      console.error("Error deleting budget", e);
      showNotification('error', "Could not delete budget.");
    }
  };

  const handleAddCategory = async (name: string, type: TransactionType) => {
    try {
      await addCategory(userId, name, type);
      showNotification('success', 'Category added! (ক্যাটাগরি যোগ করা হয়েছে)');
    } catch (e) {
      showNotification('error', "Could not add category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(userId, id);
      showNotification('success', 'Category deleted! (ক্যাটাগরি মুছে ফেলা হয়েছে)');
    } catch (e) {
      showNotification('error', "Could not delete category.");
    }
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      showNotification('info', "No transactions to export for the selected period.");
      return;
    }

    try {
      const headers = ['Date', 'Title', 'Type', 'Category', 'Amount'];
      const csvRows = filteredTransactions.map(t => {
        const safeTitle = t.title.replace(/"/g, '""');
        const safeCategory = t.category.replace(/"/g, '""');
        const dateStr = new Date(t.date).toLocaleDateString();

        return [
          dateStr,
          `"${safeTitle}"`,
          t.type,
          `"${safeCategory}"`,
          t.amount
        ].join(',');
      });

      const csvContent = [headers.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `cashier_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('success', 'Export successful! (ডাউনলোড সম্পন্ন হয়েছে)');
    } catch (e) {
      showNotification('error', "Export failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Toast Notification */}
      {notification && (
        <NotificationToast 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2.5 rounded-xl shadow-md">
              <Wallet size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cash<span className="text-blue-600">ier</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-gray-900 font-semibold">
                  {isGuest ? (guestName || 'Guest User') : (currentUser?.displayName || currentUser?.email)}
                </span>
                {!isGuest && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                     {currentUser?.displayName ? currentUser.email : 'Personal Account'}
                  </span>
                )}
             </div>
             
             <button
                onClick={() => setShowCategoryManager(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Manage Categories"
             >
                <Settings size={20} />
             </button>

             <button 
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Log Out"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Date Filter & Export */}
        <DateFilter 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={() => { setStartDate(''); setEndDate(''); }}
          onExport={handleExportCSV}
        />

        {/* AI Advisor Section (Context Aware) */}
        <AIAdvisor transactions={filteredTransactions} />

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <TransactionForm 
              onAdd={handleAddTransaction} 
              categories={categories}
            />
            
            {/* Budgets track spending within the selected period */}
            <BudgetGoals 
              budgets={budgets} 
              transactions={filteredTransactions} 
              categories={categories}
              onSaveBudget={handleSaveBudget}
              onDeleteBudget={handleDeleteBudget}
            />
            
            <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
             <div className="sticky top-24">
               <Charts transactions={filteredTransactions} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('Guest User');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsGuest(false);
    setGuestName('Guest User');
    if (auth) {
      await signOut(auth);
    }
  };

  // 1. If user is logged in (Guest or Firebase), show Dashboard
  if (currentUser || isGuest) {
    return <Dashboard isGuest={isGuest} guestName={guestName} onLogout={handleLogout} />;
  }

  // 2. Default: Show Login Screen
  return (
    <Login 
      onGuestLogin={(name) => {
        if (name) setGuestName(name);
        setIsGuest(true);
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;