import { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { getSectorColor } from '../theme/colors';
import type { AccountSummary } from '../services/portfolioService';
import { formatCurrency } from '../utils/formatters';

interface AccountListProps {
  accounts: AccountSummary[];
}

export default function AccountList({ accounts }: AccountListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };



  return (
    <div className="bg-card-surface rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-text-default">
          Portfolio Snapshots
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-1.5 rounded-full bg-background-canvas border border-border hover:bg-background-default transition-colors text-text-default cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-1.5 rounded-full bg-background-canvas border border-border hover:bg-background-default transition-colors text-text-default cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {accounts.map((account) => (
          <div
            key={account.sector}
            className="bg-transparent rounded-2xl p-5 border border-border flex flex-col gap-3 min-w-[280px] snap-start transition-all hover:border-primary/30"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: getSectorColor(account.sector) }}
              >
                {account.sector.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-text-default">
                  {account.sector}
                </div>
                <div className="text-xs text-text-neutral">
                  {account.positions} position{account.positions !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="text-lg font-semibold text-text-default">
              {formatCurrency(account.totalValue)}
            </div>
            
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${account.percentageChange >= 0 ? 'text-success' : 'text-negative'}`}>
              {account.percentageChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{account.percentageChange >= 0 ? '+' : ''}{account.percentageChange.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
