import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendDisplayProps {
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  currentPrice: number;
  ticker: string;
}

export const TrendDisplay: React.FC<TrendDisplayProps> = ({ trend, currentPrice, ticker }) => {
  const isUp = trend === 'UP';
  const isDown = trend === 'DOWN';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Price Card */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center backdrop-blur-sm">
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{ticker} Current Price</span>
        <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">${currentPrice.toFixed(2)}</span>
            <span className="text-slate-500 text-sm">USD</span>
        </div>
      </div>

      {/* Trend Card */}
      <div className={`
        relative overflow-hidden p-6 rounded-2xl border flex items-center justify-between backdrop-blur-sm
        ${isUp ? 'bg-emerald-950/30 border-emerald-900/50' : ''}
        ${isDown ? 'bg-rose-950/30 border-rose-900/50' : ''}
        ${!isUp && !isDown ? 'bg-slate-900/50 border-slate-800' : ''}
      `}>
        <div>
          <span className={`text-sm font-medium uppercase tracking-wider mb-2 block
            ${isUp ? 'text-emerald-400' : ''}
            ${isDown ? 'text-rose-400' : ''}
            ${!isUp && !isDown ? 'text-slate-400' : ''}
          `}>
            Technical Trend
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold
                ${isUp ? 'text-emerald-400' : ''}
                ${isDown ? 'text-rose-400' : ''}
                ${!isUp && !isDown ? 'text-slate-200' : ''}
            `}>
              {isUp ? 'BULLISH' : isDown ? 'BEARISH' : 'NEUTRAL'}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2">Based on 5-Day SMA Crossover</p>
        </div>

        <div className={`
            p-4 rounded-full
            ${isUp ? 'bg-emerald-500/20 text-emerald-400' : ''}
            ${isDown ? 'bg-rose-500/20 text-rose-400' : ''}
            ${!isUp && !isDown ? 'bg-slate-700/50 text-slate-400' : ''}
        `}>
            {isUp && <TrendingUp size={32} />}
            {isDown && <TrendingDown size={32} />}
            {!isUp && !isDown && <Minus size={32} />}
        </div>
      </div>
    </div>
  );
};