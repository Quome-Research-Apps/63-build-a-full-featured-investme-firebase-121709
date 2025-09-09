'use client';

import * as React from 'react';
import Header from '@/components/header';
import PortfolioOverview from '@/components/dashboard/portfolio-overview';
import HoldingsTable from '@/components/dashboard/holdings-table';
import StockSearchCard from '@/components/dashboard/stock-search-card';
import StockDetailSheet from '@/components/dashboard/stock-detail-sheet';

export type Holding = {
  ticker: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
};

const initialHoldings: Holding[] = [
  { name: 'Apple Inc.', ticker: 'AAPL', shares: 50, purchasePrice: 150.25, currentPrice: 175.5 },
  { name: 'Microsoft Corp.', ticker: 'MSFT', shares: 30, purchasePrice: 280.7, currentPrice: 330.9 },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN', shares: 20, purchasePrice: 130.4, currentPrice: 135.2 },
  { name: 'NVIDIA Corp.', ticker: 'NVDA', shares: 40, purchasePrice: 450.0, currentPrice: 490.6 },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', shares: 15, purchasePrice: 125.8, currentPrice: 140.1 },
];

export default function DashboardPage() {
  const [holdings, setHoldings] = React.useState<Holding[]>(initialHoldings);
  const [selectedStock, setSelectedStock] = React.useState<Holding | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHoldings(prevHoldings =>
        prevHoldings.map(holding => {
          const change = (Math.random() - 0.5) * 2; // -1 to +1
          const newPrice = Math.max(0, holding.currentPrice + change);
          return { ...holding, currentPrice: newPrice };
        })
      );
    }, 3000); // Update prices every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddHolding = (newHolding: Omit<Holding, 'currentPrice' | 'name'>) => {
    // In a real app, you'd fetch the name and current price
    const newFullHolding: Holding = {
      ...newHolding,
      name: `${newHolding.ticker} Company`,
      currentPrice: newHolding.purchasePrice,
    };
    setHoldings(prev => [...prev, newFullHolding]);
  };

  const handleSelectStock = (ticker: string) => {
    const stock = holdings.find(h => h.ticker === ticker);
    if (stock) {
      setSelectedStock(stock);
      setSheetOpen(true);
    }
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedStock(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HoldingsTable
              holdings={holdings}
              onAddHolding={handleAddHolding}
              onSelectStock={handleSelectStock}
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <PortfolioOverview holdings={holdings} />
            <StockSearchCard />
          </div>
        </div>
      </main>
      <StockDetailSheet 
        stock={selectedStock}
        open={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
