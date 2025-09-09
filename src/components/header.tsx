import { Bell, TrendingUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
          Stock Check
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
}
