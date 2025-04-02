
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  BarChart3,
  BookCopy,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: Array<'admin' | 'librarian'>;
}

const links: SidebarLink[] = [
  {
    icon: BarChart3,
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['admin', 'librarian']
  },
  {
    icon: BookCopy,
    label: 'Books',
    href: '/books',
    roles: ['admin', 'librarian']
  },
  {
    icon: ClipboardList,
    label: 'Transactions',
    href: '/transactions',
    roles: ['admin', 'librarian']
  },
  {
    icon: Users,
    label: 'Users',
    href: '/users',
    roles: ['admin']
  },
  {
    icon: BarChart3,
    label: 'Reports',
    href: '/reports',
    roles: ['admin', 'librarian']
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    roles: ['admin']
  }
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-40 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          <BookOpen className="text-white h-8 w-8" />
          {!collapsed && (
            <span className="ml-2 font-bold text-white text-xl">Library MS</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {links
            .filter(link => link.roles.includes(user.role))
            .map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => cn(
                "flex items-center py-2 px-3 rounded-md transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-white" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed ? "justify-center" : ""
              )}
            >
              <link.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-white hover:bg-sidebar-accent flex items-center",
            collapsed ? "justify-center" : ""
          )}
          onClick={() => signOut()}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  );
}
