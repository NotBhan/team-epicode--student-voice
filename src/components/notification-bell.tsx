
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBellProps {
  notifications: Notification[];
  variant?: 'default' | 'admin';
}

export function NotificationBell({ notifications: initialNotifications, variant = 'default' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(
      notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant === 'admin' ? 'ghost' : 'outline'} size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="link" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-96">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification.id)}
              />
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You have no new notifications.
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        'block border-b px-4 py-3 text-sm hover:bg-muted/50',
        notification.href && 'cursor-pointer'
      )}
    >
      <div className="flex items-start gap-3">
        {!notification.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />}
        <div className="flex-1">
          <p className={cn(!notification.read && 'font-semibold')}>{notification.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );

  if (notification.href) {
    return <Link href={notification.href}>{content}</Link>;
  }

  return content;
}
