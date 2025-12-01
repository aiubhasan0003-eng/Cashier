
import React from 'react';
import { Calendar, X, Download } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  onExport: () => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  onExport
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700 font-medium min-w-fit">
        <Calendar size={20} className="text-blue-600" />
        <span>Filter Period:</span>
      </div>
      
      <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-gray-500 whitespace-nowrap">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-gray-500 whitespace-nowrap">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(startDate || endDate) && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <X size={16} />
            Clear
          </button>
        )}
        
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap border border-gray-200"
          title="Export as CSV"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>
    </div>
  );
};
