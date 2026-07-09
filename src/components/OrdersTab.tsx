import { useState, useMemo } from 'react';
import { Plus, Minus, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import type { Transaction } from '../services/portfolioService';
import { formatCurrency } from '../utils/formatters';

interface OrdersTabProps {
  transactions: Transaction[];
  isExpanded?: boolean;
}

export default function OrdersTab({ transactions, isExpanded = false }: OrdersTabProps) {
  const [filter, setFilter] = useState<'All' | 'BUY' | 'SELL'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const INITIAL_COUNT = 4;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesFilter = filter === 'All' || transaction.type === filter;
      const matchesSearch = searchQuery === '' || 
        transaction.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchQuery]);


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return { color: '#10AE17', Icon: CheckCircle2 };
      case 'PENDING':
        return { color: '#00B6DF', Icon: Clock };
      case 'FAILED':
        return { color: '#BF221C', Icon: XCircle };
      default:
        return { color: '#687D7A', Icon: Clock };
    }
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

        <div className="flex gap-1.5">
          {['All', 'BUY', 'SELL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as 'All' | 'BUY' | 'SELL')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-full cursor-pointer transition-all ${
                filter === type
                  ? 'text-white bg-primary shadow-sm'
                  : 'text-text-neutral bg-background-default hover:bg-border hover:text-text-default'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {(isExpanded ? filteredTransactions : filteredTransactions.slice(0, INITIAL_COUNT)).map((transaction) => {
          const statusConfig = getStatusConfig(transaction.status);
          const StatusIcon = statusConfig.Icon;
          const isBuy = transaction.type === 'BUY';

          return (
            <div
              key={transaction.id}
              className="bg-transparent rounded-lg p-3 sm:px-3 sm:py-3 border border-border transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${
                    isBuy ? 'bg-primary-light text-primary' : 'bg-[#FFE5E5] text-negative'
                  }`}
                >
                  {isBuy ? <Plus size={16} /> : <Minus size={16} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-default truncate">
                    {transaction.name}
                  </div>
                  <div className="text-xs text-text-neutral truncate mt-0.5">
                    <span className="sm:hidden">{formatDate(transaction.date)}</span>
                    <span className="hidden sm:inline">{formatDate(transaction.date)} • {transaction.shares} Shares</span>
                  </div>
                </div>

                <div className="text-right shrink-0 sm:min-w-[100px]">
                  <div className="text-sm font-medium text-text-default">
                    {formatCurrency(transaction.totalAmount)}
                  </div>
                  <div 
                    className="inline-flex items-center justify-end gap-1 px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                    style={{ 
                      backgroundColor: `${statusConfig.color}15`,
                      color: statusConfig.color 
                    }}
                  >
                    <StatusIcon size={10} />
                    <span>{transaction.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:hidden justify-between items-center pt-2 border-t border-border/40 mt-3">
                <div className="text-xs text-text-neutral">Shares</div>
                <div className="text-sm font-medium text-text-default">
                  {transaction.shares}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-10 text-text-neutral text-sm">
          No transactions match your filter
        </div>
      )}
    </div>
  );
}
