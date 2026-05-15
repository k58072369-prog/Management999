import { useListNotifications, getListNotificationsQueryKey, useMarkNotificationRead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bell, Check, Info, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications();
  const queryClient = useQueryClient();
  const markRead = useMarkNotificationRead();

  const handleMarkRead = (id: string) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "attendance": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "payment": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "system": return <ShieldAlert className="h-5 w-5 text-primary" />;
      default: return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">الإشعارات</h1>
            <p className="text-muted-foreground mt-1">تنبيهات النظام ومتابعة الطلاب</p>
          </div>
        </div>
      </div>

      <Card className="border-gold-500/20">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !notifications?.length ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center">
              <Bell className="h-12 w-12 text-muted mb-4" />
              لا توجد إشعارات في الوقت الحالي
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div key={notif.id} className={cn("p-4 flex gap-4 transition-colors hover:bg-muted/30", !notif.is_read && "bg-primary/5")}>
                  <div className="mt-1 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("font-semibold text-secondary", !notif.is_read && "text-primary")}>{notif.title}</h4>
                      <span className="text-xs text-muted-foreground" dir="ltr">
                        {new Date(notif.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    {notif.student_name && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-secondary">
                        الطالب: {notif.student_name}
                      </div>
                    )}
                  </div>
                  {!notif.is_read && (
                    <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleMarkRead(notif.id)} title="تحديد كمقروء">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}