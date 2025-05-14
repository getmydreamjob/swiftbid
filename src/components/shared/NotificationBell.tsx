// src/components/shared/NotificationBell.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Briefcase } from 'lucide-react'; // Added Briefcase
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AppNotification } from '@/lib/types';
import { Badge } from '../ui/badge';
import Link from 'next/link';

const mockNotifications: AppNotification[] = [
  { id: '1', title: 'New Bid Received!', message: 'Contractor X submitted a bid for "Dream Home Project".', type: 'bid', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false, link: '/client/bid-requests/123' },
  { id: '2', title: 'Bid Accepted', message: 'Your bid for "Modern Villa" has been accepted.', type: 'success', timestamp: new Date(Date.now() - 7200000).toISOString(), isRead: false, link: '/contractor/bids/456' },
  { id: '3', title: 'Project Update', message: 'Client added new questions to "Beach House Reno".', type: 'info', timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: true, link: '/contractor/bid-requests/789' },
  { id: '4', title: 'System Maintenance', message: 'Scheduled maintenance on Sunday at 2 AM.', type: 'warning', timestamp: new Date(Date.now() - 172800000).toISOString(), isRead: true },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, fetch notifications from an API
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // In a real app, also call an API to mark as read
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-accent" />; // Use theme accent color
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />; // Keep yellow for warning
      case 'error': return <AlertTriangle className="h-4 w-4 text-destructive" />; // Use theme destructive color
      case 'bid': return <Briefcase className="h-4 w-4 text-primary" />; // Use lucide-react Briefcase
      default: return <Info className="h-4 w-4 text-primary" />; // Use theme primary for info
    }
  };

  if (!mounted) { // Avoid hydration mismatch for unreadCount
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">
            No new notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/80 ${!notification.isRead ? 'bg-primary/5' : ''}`}
              onClick={() => markAsRead(notification.id)}
              asChild={!!notification.link} // Make item a link if link exists
            >
              {notification.link ? (
                <Link href={notification.link} className="flex items-start gap-3 w-full h-full no-underline"> {/* Ensure link covers the item and styles */}
                  {getIconForType(notification.type)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                  </div>
                  {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary self-center ml-2 shrink-0"></div>}
                </Link>
              ) : (
                <> {/* Fragment for non-link items to maintain structure */}
                  {getIconForType(notification.type)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                  </div>
                  {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary self-center ml-2 shrink-0"></div>}
                </>
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center py-2">
          <Link href="/notifications" className="text-sm text-primary hover:underline">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
