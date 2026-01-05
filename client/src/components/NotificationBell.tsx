import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import NotificationCenter from './NotificationCenter';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const { data: notificationsData, refetch } = trpc.notifications.getNotifications.useQuery(
    { limit: 50, offset: 0, unreadOnly: false },
    { enabled: isOpen } // Only fetch when modal is open
  );

  // Refetch every 10 seconds for real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, refetch]);

  // Update unread count
  useEffect(() => {
    if (notificationsData?.unreadCount) {
      setUnreadCount(notificationsData.unreadCount);
    }
  }, [notificationsData?.unreadCount]);

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {isOpen && (
        <NotificationCenter
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          notifications={notificationsData?.notifications || []}
          unreadCount={unreadCount}
          onRefresh={() => refetch()}
        />
      )}
    </>
  );
}
