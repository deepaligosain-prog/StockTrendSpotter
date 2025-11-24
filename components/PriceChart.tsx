import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { StockDataPoint, ComparisonDataPoint } from '../types';

interface PriceChartProps {
  data: any[];
  isComparison?: boolean;
  ticker1?: string;
  ticker2?: string;
  smaPeriod?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  isComparison = false, 
  ticker1, 
  ticker2, 
  smaPeriod 
}) => {
  if (data.length === 0) return null;

  // Domain calculations
  const getDomain = (key: string) => {
      const vals = data.map(d => d[key]);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const padding = (max - min) * 0.1;
      return [min - padding, max + padding];
  };

  return (
    <div className="w-full h-[400px] bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
        {isComparison ? `Price Comparison: ${ticker1} vs ${ticker2}` : `Price History vs ${smaPeriod}-Day SMA`}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          
          {/* Axis 1 - Left */}
          <YAxis 
            yAxisId="left"
            domain={getDomain(isComparison ? 'price1' : 'price')}
            stroke={isComparison ? "#60a5fa" : "#64748b"} // Blue for Ticker 1 in compare mode
            tick={{ fill: isComparison ? "#60a5fa" : '#64748b', fontSize: 12 }}
            tickFormatter={(val) => `$${val.toFixed(0)}`}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          {/* Axis 2 - Right (Only for Comparison) */}
          {isComparison && (
            <YAxis 
                yAxisId="right"
                orientation="right"
                domain={getDomain('price2')}
                stroke="#c084fc" // Purple for Ticker 2
                tick={{ fill: '#c084fc', fontSize: 12 }}
                tickFormatter={(val) => `$${val.toFixed(0)}`}
                axisLine={false}
                tickLine={false}
                width={60}
            />
          )}

          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              borderColor: '#334155', 
              borderRadius: '12px', 
              color: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
            }}
            itemStyle={{ color: '#e2e8f0' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
            formatter={(value: number, name: string) => {
                if (name === 'price1') return [`$${value.toFixed(2)}`, ticker1];
                if (name === 'price2') return [`$${value.toFixed(2)}`, ticker2];
                if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                return [`$${value.toFixed(2)}`, name];
            }}
          />

          {!isComparison ? (
            <>
                <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    name="price"
                />
                <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sma" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false}
                    strokeDasharray="5 5"
                    name={`SMA (${smaPeriod})`}
                />
            </>
          ) : (
            <>
                <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="price1" 
                    stroke="#3b82f6" // Blue
                    strokeWidth={3} 
                    dot={false}
                    name="price1"
                />
                <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="price2" 
                    stroke="#c084fc" // Purple
                    strokeWidth={3} 
                    dot={false}
                    name="price2"
                />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};