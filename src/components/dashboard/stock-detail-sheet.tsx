'use client';

import type { Holding } from '@/app/page';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import PriceChart from './price-chart';
import AnalystRatings from './analyst-ratings';
import EarningsEstimate from './earnings-estimate';

type StockDetailSheetProps = {
  stock: Holding | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function StockDetailSheet({ stock, open, onOpenChange }: StockDetailSheetProps) {
  if (!stock) return null;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="p-6 bg-muted/50">
            <SheetTitle className="font-headline text-2xl">{stock.name}</SheetTitle>
            <SheetDescription>
              A detailed financial overview for {stock.ticker}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 p-6">
            <PriceChart ticker={stock.ticker} />
            <div className="grid md:grid-cols-2 gap-6">
              <AnalystRatings />
              <EarningsEstimate />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
