import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Transaction, TransactionType, Budget, CategoryItem, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../types';

const LOCAL_STORAGE_KEY = 'my_money_transactions';
const LOCAL_STORAGE_BUDGETS_KEY = 'my_money_budgets';
const LOCAL_STORAGE_CATEGORIES_KEY = 'my_money_categories';

// --- Local Storage Helpers (Fallback for Guests) ---

const getLocalData = (): Transaction[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing local storage data", error);
    return [];
  }
};

const setLocalData = (data: Transaction[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const getLocalBudgets = (): Budget[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BUDGETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const setLocalBudgets = (data: Budget[]) => {
  localStorage.setItem(LOCAL_STORAGE_BUDGETS_KEY, JSON.stringify(data));
};

const getLocalCategories = (): CategoryItem[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (data) return JSON.parse(data);
    
    // Seed defaults if empty
    const defaults: CategoryItem[] = [
      ...DEFAULT_INCOME_CATEGORIES.map(name => ({ id: Math.random().toString(36), name, type: 'AY' as TransactionType })),
      ...DEFAULT_EXPENSE_CATEGORIES.map(name => ({ id: Math.random().toString(36), name, type: 'BAY' as TransactionType }))
    ];
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(defaults));
    return defaults;
  } catch (error) {
    return [];
  }
};

const setLocalCategories = (data: CategoryItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(data));
};

const localListeners = new Set<(data: Transaction[]) => void>();
const localBudgetListeners = new Set<(data: Budget[]) => void>();
const localCategoryListeners = new Set<(data: CategoryItem[]) => void>();

const notifyLocalListeners = () => {
  const data = getLocalData();
  localListeners.forEach(listener => listener(data));
};

const notifyLocalBudgetListeners = () => {
  const data = getLocalBudgets();
  localBudgetListeners.forEach(listener => listener(data));
};

const notifyLocalCategoryListeners = () => {
  const data = getLocalCategories();
  localCategoryListeners.forEach(listener => listener(data));
};

// --- Service Functions ---

const getUserTxCollection = (userId: string) => {
  if (!db) throw new Error("Database not initialized");
  return collection(db, 'users', userId, 'transactions');
};

const getUserBudgetCollection = (userId: string) => {
  if (!db) throw new Error("Database not initialized");
  return collection(db, 'users', userId, 'budgets');
};

const getUserCategoryCollection = (userId: string) => {
  if (!db) throw new Error("Database not initialized");
  return collection(db, 'users', userId, 'categories');
};

// --- Transactions ---

export const subscribeToTransactions = (
  userId: string | null,
  onUpdate: (data: Transaction[]) => void,
  onError: (error: Error) => void
) => {
  if (db && userId) {
    try {
      const q = query(getUserTxCollection(userId), orderBy('date', 'desc'));
      return onSnapshot(q, 
        (snapshot) => {
          const transactions = snapshot.docs.map(doc => {
            const data = doc.data();
            let dateStr: string;
            if (data.date && typeof data.date.toDate === 'function') {
               dateStr = data.date.toDate().toISOString();
            } else if (data.date instanceof Timestamp) {
               dateStr = data.date.toDate().toISOString();
            } else {
               dateStr = data.date || new Date().toISOString();
            }
            return {
              id: doc.id,
              title: data.title,
              amount: data.amount,
              type: data.type,
              category: data.category || 'Other (অন্যান্য)',
              date: dateStr
            } as Transaction;
          });
          onUpdate(transactions);
        },
        (error) => onError(error)
      );
    } catch (err: any) {
      onError(new Error(err.message));
      return () => {};
    }
  }

  onUpdate(getLocalData());
  localListeners.add(onUpdate);
  return () => {
    localListeners.delete(onUpdate);
  };
};

export const addTransaction = async (userId: string | null, title: string, amount: number, type: TransactionType, category: string) => {
  if (db && userId) {
    await addDoc(getUserTxCollection(userId), {
      title, amount, type, category, date: new Date().toISOString()
    });
    return;
  }
  const newTx: Transaction = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title, amount, type, category, date: new Date().toISOString()
  };
  const currentData = getLocalData();
  setLocalData([newTx, ...currentData]);
  notifyLocalListeners();
};

export const deleteTransaction = async (userId: string | null, id: string) => {
  if (db && userId) {
    await deleteDoc(doc(db, 'users', userId, 'transactions', id));
    return;
  }
  const currentData = getLocalData();
  setLocalData(currentData.filter(t => t.id !== id));
  notifyLocalListeners();
};

// --- Budgets ---

export const subscribeToBudgets = (userId: string | null, onUpdate: (data: Budget[]) => void) => {
  if (db && userId) {
    const q = query(getUserBudgetCollection(userId));
    return onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
      onUpdate(budgets);
    });
  } else {
    onUpdate(getLocalBudgets());
    localBudgetListeners.add(onUpdate);
    return () => localBudgetListeners.delete(onUpdate);
  }
};

export const saveBudget = async (userId: string | null, category: string, limit: number) => {
  const id = category.replace(/\s+/g, '-').toLowerCase();
  if (db && userId) {
    await setDoc(doc(db, 'users', userId, 'budgets', id), { category, limit });
  } else {
    const budgets = getLocalBudgets();
    const existingIndex = budgets.findIndex(b => b.category === category);
    if (existingIndex >= 0) budgets[existingIndex].limit = limit;
    else budgets.push({ id, category, limit });
    setLocalBudgets(budgets);
    notifyLocalBudgetListeners();
  }
};

export const deleteBudget = async (userId: string | null, id: string) => {
  if (db && userId) {
    await deleteDoc(doc(db, 'users', userId, 'budgets', id));
  } else {
    const budgets = getLocalBudgets().filter(b => b.id !== id);
    setLocalBudgets(budgets);
    notifyLocalBudgetListeners();
  }
};

// --- Categories ---

export const subscribeToCategories = (userId: string | null, onUpdate: (data: CategoryItem[]) => void) => {
  if (db && userId) {
    const q = query(getUserCategoryCollection(userId));
    return onSnapshot(q, (snapshot) => {
      // If no categories exist, seed defaults
      if (snapshot.empty) {
        const batch = writeBatch(db!);
        const defaults: CategoryItem[] = [
          ...DEFAULT_INCOME_CATEGORIES.map(name => ({ id: '', name, type: 'AY' as TransactionType })),
          ...DEFAULT_EXPENSE_CATEGORIES.map(name => ({ id: '', name, type: 'BAY' as TransactionType }))
        ];
        
        defaults.forEach(cat => {
          const newDocRef = doc(getUserCategoryCollection(userId));
          batch.set(newDocRef, { name: cat.name, type: cat.type });
        });
        
        batch.commit().catch(console.error);
        return; // Snapshot will update again after write
      }

      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
      onUpdate(categories);
    });
  } else {
    onUpdate(getLocalCategories());
    localCategoryListeners.add(onUpdate);
    return () => localCategoryListeners.delete(onUpdate);
  }
};

export const addCategory = async (userId: string | null, name: string, type: TransactionType) => {
  if (db && userId) {
    await addDoc(getUserCategoryCollection(userId), { name, type });
  } else {
    const categories = getLocalCategories();
    categories.push({ id: Date.now().toString(), name, type });
    setLocalCategories(categories);
    notifyLocalCategoryListeners();
  }
};

export const deleteCategory = async (userId: string | null, id: string) => {
  if (db && userId) {
    await deleteDoc(doc(db, 'users', userId, 'categories', id));
  } else {
    const categories = getLocalCategories().filter(c => c.id !== id);
    setLocalCategories(categories);
    notifyLocalCategoryListeners();
  }
};