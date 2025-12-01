import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationToastProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-emerald-500" />,
    error: <AlertCircle size={20} className="text-rose-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const styles = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    error: 'bg-rose-50 border-rose-100 text-rose-900',
    info: 'bg-blue-50 border-blue-100 text-blue-900'
  };

  return (
    <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-auto z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-gray-200/50 animate-in slide-in-from-top-2 fade-in duration-300 ${styles[type]}`}>
      <div className="shrink-0">
        {icons[type]}
      </div>
      <p className="font-medium text-sm flex-1 mr-2">{message}</p>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-black/5 rounded-full transition shrink-0"
      >
        <X size={16} className="opacity-50" />
      </button>
    </div>
  );
};