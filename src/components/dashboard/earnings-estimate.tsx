import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const estimates = [
  { metric: 'EPS Estimate (Current Qtr)', value: '$2.15' },
  { metric: 'EPS Estimate (Next Qtr)', value: '$2.30' },
  { metric: 'Revenue Estimate (Current Qtr)', value: '$95.5B' },
  { metric: 'Revenue Estimate (Next Qtr)', value: '$101.2B' },
  { metric: 'Earnings Date', value: 'Oct 28, 2024' },
];

export default function EarningsEstimate() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Earnings Estimate</CardTitle>
        <CardDescription>Upcoming quarterly estimates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {estimates.map((item, index) => (
            <React.Fragment key={item.metric}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.metric}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              {index < estimates.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
