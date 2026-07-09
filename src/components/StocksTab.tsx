import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { portfolioService, type Holding } from '../services/portfolioService';
import { formatCurrency } from '../utils/formatters';
import TickerIcon from './TickerIcon';

interface StocksTabProps {
  holdings: Holding[];
  isExpanded?: boolean;
}

export default function StocksTab({ holdings, isExpanded = false }: StocksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const INITIAL_COUNT = 4;

  const sectors = useMemo(() => {
    const uniqueSectors = Array.from(new Set(holdings.map(h => h.sector)));
    return ['All', ...uniqueSectors];
  }, [holdings]);

  const filteredHoldings = useMemo(() => {
    return holdings.filter(holding => {
      const matchesSearch = searchQuery === '' || 
        holding.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = selectedSector === 'All' || holding.sector === selectedSector;
      
      return matchesSearch && matchesSector;
    });
  }, [holdings, searchQuery, selectedSector]);


  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-neutral">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by ticker or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-3 text-sm border border-border rounded-lg bg-transparent text-text-default placeholder:text-text-disabled outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`py-1.5 px-3 text-xs font-semibold rounded-full cursor-pointer transition-all whitespace-nowrap ${
                  selectedSector === sector
                    ? 'text-white bg-primary shadow-sm'
                    : 'text-text-neutral bg-background-default hover:bg-border hover:text-text-default'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-card-surface  to-transparent opacity-50 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card-surface/50 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {(isExpanded ? filteredHoldings : filteredHoldings.slice(0, INITIAL_COUNT)).map((holding) => {
          const gainLoss = portfolioService.calculateGainLoss(holding);
          const currentValue = holding.shares * holding.currentPrice;
          const hasInvalidData = holding.currentPrice === 0 || holding.shares === 0;

          return (
            <div
              key={holding.id}
              className="bg-transparent rounded-lg p-3 sm:px-3 sm:py-3 border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <TickerIcon ticker={holding.ticker} sector={holding.sector} />
                
                <div className="flex-1 min-w-0 sm:min-w-[120px]">
                  <div className="text-sm font-medium text-text-default truncate">
                    {holding.ticker}
                  </div>
                  <div className="text-xs text-text-neutral truncate">
                    {holding.name}
                  </div>
                </div>

                <div className="hidden sm:block text-right min-w-[90px] shrink-0">
                  <div className="text-xs text-text-neutral">Shares</div>
                  <div className="text-sm font-medium text-text-default">
                    {holding.shares}
                  </div>
                </div>

                <div className="text-right shrink-0 sm:min-w-[120px] sm:ml-6">
                  <div className="text-sm font-medium text-text-default">
                    {hasInvalidData ? '—' : formatCurrency(currentValue)}
                  </div>
                  {hasInvalidData ? (
                    <span className="text-[10px] italic text-text-disabled">
                      No data
                    </span>
                  ) : (
                    <div className={`text-xs font-medium flex flex-col sm:block ${gainLoss.amount >= 0 ? 'text-success' : 'text-negative'}`}>
                      <span>{gainLoss.amount >= 0 ? '+' : ''}{formatCurrency(gainLoss.amount)}</span>
                      <span className="text-[10px] sm:text-xs sm:ml-1">({gainLoss.amount >= 0 ? '+' : ''}{formatNumber(gainLoss.percentage)}%)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:hidden justify-between items-center pt-2 border-t border-border/40 mt-3">
                <div className="text-xs text-text-neutral">Shares</div>
                <div className="text-sm font-medium text-text-default">
                  {holding.shares}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHoldings.length === 0 && (
        <div className="text-center py-10 text-text-neutral text-sm">
          No holdings match your filters
        </div>
      )}
    </div>
  );
}
