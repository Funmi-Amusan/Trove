import portfolioData from '../../Portfolio_data.json';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  name: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface PortfolioData {
  user: {
    name: string;
    accountId: string;
    lastUpdated: string;
  };
  summary: {
    totalPortfolioValue: number;
    totalInvested: number;
    currency: string;
  };
  holdings: Holding[];
  transactions: Transaction[];
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface AccountSummary {
  sector: string;
  positions: number;
  totalValue: number;
  percentageChange: number;
}

const DELAY_MS = 500;

const simulateDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, DELAY_MS));

export const portfolioService = {
  async getPortfolioData(): Promise<PortfolioData> {
    await simulateDelay();
    return portfolioData as PortfolioData;
  },

  async getUser(): Promise<{ name: string; accountId: string; lastUpdated: string }> {
    await simulateDelay();
    return portfolioData.user;
  },

  async getHoldings(): Promise<Holding[]> {
    await simulateDelay();
    return portfolioData.holdings;
  },

  async getTransactions(): Promise<Transaction[]> {
    await simulateDelay();
    return portfolioData.transactions as Transaction[];
  },

  async getSectorAllocations(): Promise<SectorAllocation[]> {
    await simulateDelay();
    
    const holdings = portfolioData.holdings.filter(h => h.shares > 0 && h.currentPrice > 0);
    const sectorMap = new Map<string, number>();
    
    holdings.forEach(holding => {
      const value = holding.shares * holding.currentPrice;
      sectorMap.set(holding.sector, (sectorMap.get(holding.sector) || 0) + value);
    });
    
    const totalValue = Array.from(sectorMap.values()).reduce((sum, val) => sum + val, 0);
    
    return Array.from(sectorMap.entries()).map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));
  },

  async getAccountSummaries(): Promise<AccountSummary[]> {
    await simulateDelay();
    
    const holdings = portfolioData.holdings.filter(h => h.shares > 0);
    const sectorMap = new Map<string, { positions: number; totalValue: number; totalInvested: number }>();
    
    holdings.forEach(holding => {
      const currentValue = holding.shares * holding.currentPrice;
      const investedValue = holding.shares * holding.avgCost;
      const current = sectorMap.get(holding.sector) || { positions: 0, totalValue: 0, totalInvested: 0 };
      sectorMap.set(holding.sector, {
        positions: current.positions + 1,
        totalValue: current.totalValue + currentValue,
        totalInvested: current.totalInvested + investedValue,
      });
    });
    
    return Array.from(sectorMap.entries()).map(([sector, data]) => {
      const percentageChange = data.totalInvested > 0 
        ? ((data.totalValue - data.totalInvested) / data.totalInvested) * 100 
        : 0;
      return {
        sector,
        positions: data.positions,
        totalValue: data.totalValue,
        percentageChange,
      };
    });
  },

  calculateGainLoss(holding: Holding): { amount: number; percentage: number } {
    const currentValue = holding.shares * holding.currentPrice;
    const investedValue = holding.shares * holding.avgCost;
    
    if (holding.currentPrice === 0 || holding.shares === 0) {
      return { amount: 0, percentage: 0 };
    }
    
    const amount = currentValue - investedValue;
    const percentage = investedValue > 0 ? (amount / investedValue) * 100 : 0;
    
    return { amount, percentage };
  },
};
