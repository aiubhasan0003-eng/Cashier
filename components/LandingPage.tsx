import React from 'react';
import { Wallet, Shield, PieChart, Sparkles, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-lg">
             <Wallet className="text-white w-6 h-6" />
           </div>
           <span className="text-2xl font-bold text-gray-900">Cash<span className="text-blue-600">ier</span></span>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-5 py-2.5 text-gray-600 font-medium hover:text-blue-600 transition"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>AI-Powered Financial Advisor</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Master Your Money <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
              Secure Your Future
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Track income, manage expenses, and get personalized financial advice in Bangla & English. 
            The smartest way to handle your personal finances.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started Free <ArrowRight size={20} />
            </button>
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 transition border border-gray-200 w-full sm:w-auto"
            >
              Try Guest Mode
            </button>
          </div>
        </div>
        
        {/* Visual/Image placeholder */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
           <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <p className="text-sm text-gray-500 font-medium">Total Balance</p>
                   <p className="text-3xl font-bold text-gray-900">৳ 24,500</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Wallet className="text-blue-600" />
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-lg shadow-sm">
                         <Sparkles className="text-emerald-600 w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900">Freelance Income</p>
                         <p className="text-xs text-gray-500">Income (আয়)</p>
                       </div>
                    </div>
                    <span className="font-bold text-emerald-600">+৳ 5,000</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-3">
                       <div className="bg-white p-2 rounded-lg shadow-sm">
                         <PieChart className="text-rose-600 w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900">Grocery Shopping</p>
                         <p className="text-xs text-gray-500">Expense (ব্যয়)</p>
                       </div>
                    </div>
                    <span className="font-bold text-rose-600">-৳ 2,400</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Cashier?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Everything you need to manage your money efficiently in one place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
               <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                 <Sparkles className="text-indigo-600 w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">AI Advisor</h3>
               <p className="text-gray-600 leading-relaxed">
                 Get personalized financial advice in Bangla from <strong>Ubaidi Financial Advisor</strong>. It analyzes your spending habits to help you save more.
               </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
               <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                 <PieChart className="text-blue-600 w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Analytics</h3>
               <p className="text-gray-600 leading-relaxed">
                 Understand where your money goes with intuitive pie charts and detailed breakdown reports of your income and expenses.
               </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
               <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                 <Shield className="text-emerald-600 w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Flexible</h3>
               <p className="text-gray-600 leading-relaxed">
                 Your data is yours. Use <strong>Guest Mode</strong> for local-only storage or create an account to sync your data across devices securely.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-1.5 rounded-lg">
                <Wallet className="text-white w-4 h-4" />
             </div>
             <span className="font-bold text-gray-900 text-lg">Cashier</span>
           </div>
           <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Cashier. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};