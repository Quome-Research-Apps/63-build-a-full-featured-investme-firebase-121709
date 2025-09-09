'use client';

import * as React from 'react';
import type { Holding } from '@/app/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AddHoldingDialog from './add-holding-dialog';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Button } from '../ui/button';

type HoldingsTableProps = {
  holdings: Holding[];
  onAddHolding: (holding: Omit<Holding, 'currentPrice' | 'name'>) => void;
  onSelectStock: (ticker: string) => void;
};

type SortConfig = {
  key: keyof Holding | 'marketValue' | 'totalReturn';
  direction: 'ascending' | 'descending';
};

export default function HoldingsTable({ holdings, onAddHolding, onSelectStock }: HoldingsTableProps) {
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>({ key: 'marketValue', direction: 'descending' });

  const filteredHoldings = holdings.filter(
    holding =>
      holding.name.toLowerCase().includes(filter.toLowerCase()) ||
      holding.ticker.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedHoldings = React.useMemo(() => {
    let sortableItems = [...filteredHoldings];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        const getCompositeValue = (holding: Holding) => {
            switch (sortConfig.key) {
                case 'marketValue':
                    return holding.shares * holding.currentPrice;
                case 'totalReturn':
                    return (holding.currentPrice - holding.purchasePrice) * holding.shares;
                default:
                    return holding[sortConfig.key as keyof Holding];
            }
        }
        
        aValue = getCompositeValue(a);
        bValue = getCompositeValue(b);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredHoldings, sortConfig]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const renderHeader = (label: string, key: SortConfig['key']) => (
    <TableHead>
        <Button variant="ghost" onClick={() => requestSort(key)} className="px-0 hover:bg-transparent">
            {label}
            {getSortIcon(key)}
        </Button>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-headline">My Portfolio</CardTitle>
            <CardDescription>A complete overview of your current holdings.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter stocks..."
                className="pl-8 sm:w-[200px] lg:w-[250px]"
                onChange={e => setFilter(e.target.value)}
                value={filter}
              />
            </div>
            <AddHoldingDialog onAddHolding={onAddHolding} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {renderHeader('Company', 'name')}
              {renderHeader('Market Value', 'marketValue')}
              {renderHeader('Total Return', 'totalReturn')}
              <TableHead className="text-right">Shares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHoldings.map(holding => {
              const marketValue = holding.shares * holding.currentPrice;
              const totalReturn = (holding.currentPrice - holding.purchasePrice) * holding.shares;
              const isProfit = totalReturn >= 0;

              return (
                <TableRow key={holding.ticker} onClick={() => onSelectStock(holding.ticker)} className="cursor-pointer">
                  <TableCell>
                    <div className="font-medium">{holding.name}</div>
                    <div className="text-sm text-muted-foreground">{holding.ticker}</div>
                  </TableCell>
                  <TableCell>
                    {marketValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell className={cn(isProfit ? 'text-green-600' : 'text-red-600')}>
                    {totalReturn.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell className="text-right">{holding.shares}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {sortedHoldings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <p>No holdings match your filter.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
