import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, CircleDot, CalendarDays, TrendingUp, AlertCircle, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-secondary">لوحة التحكم</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "إجمالي الطلاب", value: stats.total_students, icon: Users, color: "text-primary" },
    { title: "إجمالي المعلمين", value: stats.total_teachers, icon: GraduationCap, color: "text-primary" },
    { title: "إجمالي الحلقات", value: stats.total_circles, icon: CircleDot, color: "text-accent" },
    { title: "الحصص المنجزة", value: stats.total_sessions, icon: CalendarDays, color: "text-accent" },
    { title: "حضور اليوم", value: stats.present_today, icon: TrendingUp, color: "text-green-600" },
    { title: "غياب اليوم", value: stats.absent_today, icon: AlertCircle, color: "text-destructive" },
    { title: "إجمالي الإيرادات", value: `${stats.total_revenue} ج.م`, icon: TrendingUp, color: "text-primary" },
    { title: "صافي الربح", value: `${stats.profit} ج.م`, icon: TrendingUp, color: "text-accent" },
  ];

  const chartData = [
    { name: "الإيرادات", value: stats.total_revenue },
    { name: "المصروفات", value: stats.total_expenses },
    { name: "الربح", value: stats.profit },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">نظرة عامة على أداء المؤسسة اليوم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-gold-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-secondary">الملخص المالي</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-secondary flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              أحدث الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_notifications?.length ? (
                stats.recent_notifications.map((notif) => (
                  <div key={notif.id} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-muted">
                    <span className="font-semibold text-sm text-secondary">{notif.title}</span>
                    <span className="text-sm text-muted-foreground">{notif.message}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">لا توجد إشعارات حديثة</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}