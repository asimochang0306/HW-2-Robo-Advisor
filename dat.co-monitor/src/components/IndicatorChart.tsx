import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { PricePoint } from '../services/dataService';

interface Props {
  data: PricePoint[];
}

export const IndicatorChart: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => data, [data]);

  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-zinc-500">No data available</div>;

  return (
    <div className="w-full space-y-8">
      <div className="h-[400px] w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
        <h3 className="text-zinc-400 text-xs font-mono uppercase mb-4 tracking-widest">MSTR Premium to NAV (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px' }}
              itemStyle={{ color: '#f59e0b' }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="premium" 
              stroke="#f59e0b" 
              fillOpacity={1} 
              fill="url(#colorPremium)" 
              strokeWidth={2}
              name="Premium %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[300px] w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
        <h3 className="text-zinc-400 text-xs font-mono uppercase mb-4 tracking-widest">MSTR Price vs NAV (USD)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px' }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="mstrPrice" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              name="MSTR Market Price"
            />
            <Line 
              type="monotone" 
              dataKey="nav" 
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              name="NAV (BTC Value)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
