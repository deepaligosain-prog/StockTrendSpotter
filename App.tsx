import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PriceChart } from './components/PriceChart';
import { TrendDisplay } from './components/TrendDisplay';
import { CorrelationDisplay } from './components/CorrelationDisplay';
import { SourceList } from './components/SourceList';
import { analyzeStock, compareStocks } from './services/geminiService';
import { AnalysisResult, LoadingState } from './types';
import { TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ticker1: string, ticker2?: string) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      let data;
      if (ticker2) {
        data = await compareStocks(ticker1, ticker2);
      } else {
        data = await analyzeStock(ticker1);
      }
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze data. Please try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200">
      
      {/* Header */}
      <header className="border-b border-slate-900/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TrendSpotter
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Intro / Search Area */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Spot the trend. <br/>
            <span className="text-blue-500">Before it moves.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            Analyze recent price action using Gemini. Use comparison mode to check correlations between two assets.
          </p>
          
          <SearchBar onSearch={handleSearch} isLoading={loadingState === LoadingState.LOADING} />
        </div>

        {/* Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          
          {loadingState === LoadingState.ERROR && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-200 p-6 rounded-2xl text-center max-w-2xl mx-auto">
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {result.type === 'SINGLE' ? (
                <>
                  <TrendDisplay 
                    trend={result.trend} 
                    currentPrice={result.currentPrice} 
                    ticker={result.ticker} 
                  />
                  <PriceChart 
                    data={result.data} 
                    smaPeriod={result.smaPeriod}
                    isComparison={false}
                  />
                </>
              ) : (
                <>
                  <CorrelationDisplay 
                    ticker1={result.ticker1} 
                    ticker2={result.ticker2} 
                    correlation={result.correlation} 
                  />
                  <PriceChart 
                    data={result.data} 
                    isComparison={true}
                    ticker1={result.ticker1}
                    ticker2={result.ticker2}
                  />
                </>
              )}
              
              <SourceList sources={result.sources} />
            </div>
          )}

          {loadingState === LoadingState.IDLE && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pointer-events-none blur-[1px]">
               <div className="bg-slate-900 h-32 rounded-2xl"></div>
               <div className="bg-slate-900 h-32 rounded-2xl"></div>
               <div className="bg-slate-900 h-32 rounded-2xl"></div>
               <div className="col-span-1 md:col-span-3 bg-slate-900 h-64 rounded-2xl"></div>
            </div>
          )}
        </div>

      </main>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-12">
        <p>Powered by Google Gemini 2.5 Flash & Google Search Grounding</p>
      </footer>
    </div>
  );
};

export default App;