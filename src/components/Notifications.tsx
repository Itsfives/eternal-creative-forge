import React from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  order: Package,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  order: 'text-purple-500',
};

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <NotificationList />
      </SheetContent>
    </Sheet>
  );
}

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Bell className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex-row items-center justify-between">
        <SheetTitle>Notifications</SheetTitle>
        {notifications.some(n => !n.read) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </SheetHeader>
      
      <ScrollArea className="flex-1 mt-4">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type as keyof typeof iconMap] || Info;
            const iconColor = colorMap[notification.type as keyof typeof colorMap] || 'text-gray-500';
            
            return (
              <Card 
                key={notification.id} 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  !notification.read && "bg-accent/50"
                )}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-5 w-5 mt-0.5", iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleDateString()} at{' '}
                      {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}