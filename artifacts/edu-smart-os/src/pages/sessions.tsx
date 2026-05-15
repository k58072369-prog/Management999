import { useListSessions } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Sessions() {
  const { data: sessions, isLoading } = useListSessions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">الحصص اليومية</h1>
          <p className="text-muted-foreground mt-1">سجل الحصص ومتابعة الحضور والانصراف</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="ml-2 h-4 w-4" />
          بدء حصة جديدة
        </Button>
      </div>

      <Card className="border-gold-500/20">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : !sessions?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              لا يوجد حصص مسجلة
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-muted-foreground bg-muted/50 uppercase">
                  <tr>
                    <th className="px-4 py-3 rounded-tr-lg">التاريخ</th>
                    <th className="px-4 py-3">الحلقة</th>
                    <th className="px-4 py-3">المعلم</th>
                    <th className="px-4 py-3">الحضور</th>
                    <th className="px-4 py-3">الحالة</th>
                    <th className="px-4 py-3 rounded-tl-lg text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b border-muted hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span dir="ltr">{new Date(session.date).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{session.circle_name || "غير محدد"}</td>
                      <td className="px-4 py-3">{session.teacher_name || "غير محدد"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{session.present_count || 0} / {session.student_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={session.status === "مكتملة" ? "text-green-600 border-green-600" : "text-amber-600 border-amber-600"}>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                          التفاصيل
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}