import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AIAdvisorProps {
  transactions: Transaction[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGetAdvice = async () => {
    if (transactions.length === 0) {
      setAdvice("অনুগ্রহ করে কিছু লেনদেন যোগ করুন যাতে আমি বিশ্লেষণ করতে পারি।");
      setIsOpen(true);
      return;
    }

    setLoading(true);
    setIsOpen(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  // Check if either GEMINI_API_KEY or API_KEY is present
  const hasApiKey = !!(process.env.GEMINI_API_KEY || process.env.API_KEY);

  if (!hasApiKey) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold">Ubaidi Financial Advisor</h2>
        </div>

        {!isOpen ? (
          <div>
            <p className="text-indigo-100 mb-4 max-w-xl">
              আপনার আয়-ব্যয়ের ধরন বিশ্লেষণ করে টাকা জমানোর দারুণ সব পরামর্শ নিন এবং আর্থিক লক্ষ্য পূরণ করুন।
            </p>
            <button
              onClick={handleGetAdvice}
              className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
            >
              বিশ্লেষণ করুন
            </button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            {loading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="animate-spin" />
                <span>তথ্য বিশ্লেষণ করা হচ্ছে...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                 <div className="whitespace-pre-line text-sm leading-relaxed font-medium">
                   {advice}
                 </div>
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-xs text-indigo-200 hover:text-white underline"
                 >
                   বন্ধ করুন
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};