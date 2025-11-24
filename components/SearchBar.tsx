import React, { useState } from 'react';
import { Search, Loader2, GitCompare } from 'lucide-react';

interface SearchBarProps {
  onSearch: (t1: string, t2?: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [ticker1, setTicker1] = useState('');
  const [ticker2, setTicker2] = useState('');
  const [isCompare, setIsCompare] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompare) {
        if (ticker1.trim() && ticker2.trim()) {
            onSearch(ticker1.trim(), ticker2.trim());
        }
    } else {
        if (ticker1.trim()) {
            onSearch(ticker1.trim());
        }
    }
  };

  const toggleCompare = () => {
    setIsCompare(!isCompare);
    if (!isCompare) {
        // Just switched to compare mode, maybe clear or keep Ticker 1? Keep it.
    } else {
        setTicker2('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex justify-end mb-2">
        <button 
            onClick={toggleCompare}
            className={`text-xs flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${isCompare ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
            <GitCompare size={12} />
            {isCompare ? 'Compare Mode On' : 'Compare Stocks'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative group flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
            </div>
            <input
            type="text"
            value={ticker1}
            onChange={(e) => setTicker1(e.target.value)}
            placeholder={isCompare ? "First ticker (e.g. GOOGL)" : "Enter stock ticker (e.g., AAPL)..."}
            className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl 
                        text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                        focus:border-blue-500 transition-all duration-300 shadow-xl backdrop-blur-sm"
            disabled={isLoading}
            />
        </div>

        {isCompare && (
             <div className="relative flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
                </div>
                <input
                type="text"
                value={ticker2}
                onChange={(e) => setTicker2(e.target.value)}
                placeholder="Second ticker (e.g. MSFT)"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl 
                            text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                            focus:border-purple-500 transition-all duration-300 shadow-xl backdrop-blur-sm"
                disabled={isLoading}
                />
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !ticker1.trim() || (isCompare && !ticker2.trim())}
          className="md:absolute md:right-2 md:top-2 md:bottom-2 px-6 py-3 md:py-0 bg-blue-600 hover:bg-blue-500 text-white 
                     rounded-xl font-medium transition-all duration-200 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </form>
    </div>
  );
};