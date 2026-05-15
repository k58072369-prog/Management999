import { useListCircles, getListCirclesQueryKey, useDeleteCircle } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, CircleDot, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Circles() {
  const { data: circles, isLoading } = useListCircles();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteCircle = useDeleteCircle();

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحلقة؟")) {
      deleteCircle.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم حذف الحلقة بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListCirclesQueryKey() });
        },
        onError: () => {
          toast({ title: "حدث خطأ أثناء الحذف", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">الحلقات القرءانية</h1>
          <p className="text-muted-foreground mt-1">إدارة الحلقات والمجموعات</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="ml-2 h-4 w-4" />
          إضافة حلقة
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : !circles?.length ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          لا يوجد حلقات متاحة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => (
            <Card key={circle.id} className="border-gold-500/20 overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <CircleDot className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary">{circle.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">{circle.teacher_name || "بدون معلم"}</div>
                    </div>
                  </div>
                  <Badge variant={circle.status === "نشطة" ? "default" : "secondary"}>
                    {circle.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{circle.days} - {circle.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Users className="h-4 w-4" />
                  <span>{circle.student_count || 0} طلاب</span>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t border-muted/50">
                  <Button variant="outline" size="sm" className="text-primary hover:text-primary">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(circle.id)}>
                    <Trash2 className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}