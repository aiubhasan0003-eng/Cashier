import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Helper to get env vars from either Vite's import.meta.env or Node's process.env
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env['VITE_' + key] || import.meta.env[key];
      if (val) return val;
    }
  } catch (e) {}

  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {}

  return undefined;
};

// Check for GEMINI_API_KEY first (user preference), then fall back to API_KEY (platform default)
const apiKey = getEnv('GEMINI_API_KEY') || getEnv('API_KEY');

// Initialize Gemini only if API key is present
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure GEMINI_API_KEY or API_KEY in your environment.";
  }

  // Prepare data summary for the AI
  const summary = transactions.map(t => 
    `- ${t.date}: ${t.title} (${t.type}) - ${t.amount}৳`
  ).join('\n');

  const prompt = `
    তুমি হলে 'উবাইদি ফাইন্যান্সিয়াল অ্যাডভাইজার' (Ubaidi Financial Advisor)। নিচের লেনদেনগুলো বিশ্লেষণ করো (AY মানে আয়/Income, BAY মানে ব্যয়/Expense)।
    মুদ্রা: বাংলাদেশী টাকা (৳)।
    
    লেনদেনসমূহ:
    ${summary}
    
    দয়া করে বাংলায় নিচের বিষয়গুলো দাও:
    ১. বর্তমান আর্থিক অবস্থার একটি সংক্ষিপ্ত সারসংক্ষেপ।
    ২. টাকা জমানোর বা খরচ কমানোর ৩টি সুনির্দিষ্ট ও কার্যকরী পরামর্শ।
    ৩. ভাষা হবে উৎসাহব্যঞ্জক এবং পেশাদার।
    ৪. উত্তর ১৫০ শব্দের মধ্যে হতে হবে।
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "এই মুহূর্তে পরামর্শ দেওয়া সম্ভব হচ্ছে না।";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "দুঃখিত, আপনার তথ্য বিশ্লেষণে একটি সমস্যা হয়েছে।";
  }
};