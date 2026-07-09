import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import type { Holding } from '../services/portfolioService';
import { formatCurrency } from '../utils/formatters';

interface NetWorthCardProps {
  holdings: Holding[];
}

export default function NetWorthCard({ holdings }: NetWorthCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'1D' | '1W' | '1M' | 'ALL'>('1D');

  const validHoldings = holdings.filter(h => h.shares > 0 && h.currentPrice > 0);
  const totalValue = validHoldings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalInvested = validHoldings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
  const gainLoss = totalValue - totalInvested;
  const gainLossPercentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const timePeriods: Array<'1D' | '1W' | '1M' | 'ALL'> = ['1D', '1W', '1M', 'ALL'];

  const getMockChartData = () => {
    const periodMultipliers = {
      '1D': [0.98, 0.99, 0.98, 0.99, 0.995, 1],
      '1W': [0.95, 0.97, 0.96, 0.98, 0.99, 1],
      '1M': [0.9, 0.92, 0.88, 0.94, 0.96, 1],
      'ALL': [0.7, 0.75, 0.72, 0.85, 0.9, 1]
    };
    const multipliers = periodMultipliers[timePeriod];
    return multipliers.map(m => ({ value: totalValue * m }));
  };

  const mockChartData = getMockChartData();

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-text-default">
              Total Net Worth
            </h2>
            <button
              onClick={() => setIsHidden(!isHidden)}
            className="p-2 text-text-neutral border-none rounded cursor-pointer transition-colors hover:bg-background-default flex items-center justify-center"
            >
            {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex lg:gap-1 gap-0 shrink-0">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`py-1 lg:px-3 px-2 text-[11px] font-semibold rounded-full cursor-pointer transition-all ${
                  timePeriod === period
                    ? 'text-primary bg-primary-light '
                    : 'text-text-neutral hover:bg-background-default'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {isHidden ? (
          <div className="text-3xl font-semibold text-text-default tracking-[0.25em]">
            ••••••••
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="lg:text-3xl text-2xl font-semibold text-text-default">
              {formatCurrency(totalValue)}
            </div>
            <div className={`flex items-center gap-1 lg:text-base text-sm font-semibold ${gainLoss >= 0 ? 'text-success' : 'text-negative'}`}>
              {gainLoss >= 0 ? <TrendingUp size={18} strokeWidth={2.5} /> : <TrendingDown size={18} strokeWidth={2.5} />}
              {formatPercentage(gainLossPercentage)}
            </div>
          </div>
        )}
      </div>

      {!isHidden && (
        <>
          <div className="h-24 mb-2 relative rounded-lg -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gainLoss >= 0 ? '#10AE17' : '#BF221C'} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={gainLoss >= 0 ? '#10AE17' : '#BF221C'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={gainLoss >= 0 ? '#10AE17' : '#BF221C'} 
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
