
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function Header() {
  const { user, signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(3);
  
  if (!user) return null;

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-end px-6 relative z-20">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {notificationCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-border p-3 font-medium">
              Notifications
            </div>
            <div className="flex flex-col divide-y divide-border">
              <div className="p-3 hover:bg-muted">
                <p className="text-sm font-medium">5 books due for return today</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="p-3 hover:bg-muted">
                <p className="text-sm font-medium">New book added: "Physics 101"</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <div className="p-3 hover:bg-muted">
                <p className="text-sm font-medium">Overdue fine collected: $5.00</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="border-t border-border p-2">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-muted p-2 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-library-600 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-left hidden sm:block">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
