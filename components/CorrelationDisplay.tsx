import React from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface CorrelationDisplayProps {
  ticker1: string;
  ticker2: string;
  correlation: number;
}

export const CorrelationDisplay: React.FC<CorrelationDisplayProps> = ({ ticker1, ticker2, correlation }) => {
  // Determine attributes based on correlation score (-1 to 1)
  let label = "No Correlation";
  let colorClass = "text-slate-400";
  let bgClass = "bg-slate-900/50 border-slate-800";
  let icon = <Minus size={32} />;
  let description = "These assets tend to move independently.";

  if (correlation > 0.7) {
    label = "Strong Positive";
    colorClass = "text-emerald-400";
    bgClass = "bg-emerald-950/30 border-emerald-900/50";
    icon = <TrendingUp size={32} />;
    description = "These assets usually move in the same direction.";
  } else if (correlation > 0.3) {
    label = "Weak Positive";
    colorClass = "text-emerald-200";
    bgClass = "bg-emerald-950/20 border-emerald-900/30";
    icon = <TrendingUp size={32} className="opacity-70" />;
    description = "These assets show some tendency to move together.";
  } else if (correlation < -0.7) {
    label = "Strong Inverse";
    colorClass = "text-rose-400";
    bgClass = "bg-rose-950/30 border-rose-900/50";
    icon = <ArrowRightLeft size={32} />;
    description = "These assets usually move in opposite directions.";
  } else if (correlation < -0.3) {
    label = "Weak Inverse";
    colorClass = "text-rose-200";
    bgClass = "bg-rose-950/20 border-rose-900/30";
    icon = <ArrowRightLeft size={32} className="opacity-70" />;
    description = "These assets show some tendency to move oppositely.";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Correlation Score Card */}
      <div className={`relative overflow-hidden p-6 rounded-2xl border flex items-center justify-between backdrop-blur-sm ${bgClass}`}>
        <div>
          <span className={`text-sm font-medium uppercase tracking-wider mb-2 block ${colorClass}`}>
            Correlation
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold ${colorClass}`}>
              {correlation.toFixed(2)}
            </span>
            <span className={`text-lg font-medium opacity-80 ${colorClass}`}>
                {label}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2">{description}</p>
        </div>

        <div className={`p-4 rounded-full bg-slate-950/30 ${colorClass}`}>
            {icon}
        </div>
      </div>

       {/* Ticker Pair Info */}
       <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center backdrop-blur-sm">
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info size={14} />
            Comparison Pair
        </span>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                    {ticker1[0]}
                </div>
                <div>
                    <div className="font-bold text-white">{ticker1}</div>
                    <div className="text-xs text-blue-400">Primary</div>
                </div>
            </div>
            
            <div className="h-px w-10 bg-slate-700"></div>

            <div className="flex items-center gap-3 text-right">
                <div>
                    <div className="font-bold text-white">{ticker2}</div>
                    <div className="text-xs text-purple-400">Secondary</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
                    {ticker2[0]}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};