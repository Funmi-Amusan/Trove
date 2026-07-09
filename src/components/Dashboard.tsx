import { useState, useEffect } from 'react';
import { portfolioService, type Holding, type Transaction, type SectorAllocation, type AccountSummary } from '../services/portfolioService';
import NetWorthCard from './NetWorthCard';
import AllocationBar from './AllocationBar';
import AccountList from './AccountList';
import StocksTab from './StocksTab';
import OrdersTab from './OrdersTab';

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sectorAllocations, setSectorAllocations] = useState<SectorAllocation[]>([]);
  const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStocksExpanded, setIsStocksExpanded] = useState(false);
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [holdingsData, transactionsData, allocationsData, accountsData] = await Promise.all([
          portfolioService.getHoldings(),
          portfolioService.getTransactions(),
          portfolioService.getSectorAllocations(),
          portfolioService.getAccountSummaries(),
        ]);
        setHoldings(holdingsData);
        setTransactions(transactionsData);
        setSectorAllocations(allocationsData);
        setAccountSummaries(accountsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load portfolio data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-neutral">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-negative">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mb-6">
        <NetWorthCard holdings={holdings} />
        <AllocationBar allocations={sectorAllocations} />
      </div>
      
      <AccountList accounts={accountSummaries} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-card-surface rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-text-default">
              Holdings
            </h2>
            {holdings.length > 4 && (
              <button 
                onClick={() => setIsStocksExpanded(!isStocksExpanded)}
                className="whitespace-nowrap py-1.5 px-3 text-xs font-semibold text-primary rounded-md hover:bg-primary-light transition-colors cursor-pointer"
              >
                {isStocksExpanded ? 'Show less' : `View all (${holdings.length})`}
              </button>
            )}
          </div>
          <div className={isStocksExpanded ? 'max-h-[400px] overflow-y-auto' : ''}>
            <StocksTab holdings={holdings} isExpanded={isStocksExpanded} />
          </div>
        </div>
        <div className="bg-card-surface rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-text-default">
              Recent Transactions
            </h2>
            {transactions.length > 4 && (
              <button 
                onClick={() => setIsTransactionsExpanded(!isTransactionsExpanded)}
                className="whitespace-nowrap py-1.5 px-3 text-xs font-semibold text-primary rounded-md hover:bg-primary-light transition-colors cursor-pointer"
              >
                {isTransactionsExpanded ? 'Show less' : `View all (${transactions.length})`}
              </button>
            )}
          </div>
          <div className={isTransactionsExpanded ? 'max-h-[400px] overflow-y-auto' : ''}>
            <OrdersTab transactions={transactions} isExpanded={isTransactionsExpanded} />
          </div>
        </div>
      </div>
    </>
  );
}
