import { useListTeachers, getListTeachersQueryKey, useDeleteTeacher } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, GraduationCap, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Teachers() {
  const { data: teachers, isLoading } = useListTeachers();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteTeacher = useDeleteTeacher();

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
      deleteTeacher.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم حذف المعلم بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListTeachersQueryKey() });
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
          <h1 className="text-3xl font-bold text-secondary">المعلمون</h1>
          <p className="text-muted-foreground mt-1">إدارة الكادر التعليمي</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="ml-2 h-4 w-4" />
          إضافة معلم
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : !teachers?.length ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          لا يوجد معلمون متاحون
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="border-gold-500/20 overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary">{teacher.full_name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone className="ml-1 h-3 w-3" />
                        <span dir="ltr">{teacher.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm mb-4">
                  <div className="text-center">
                    <div className="text-muted-foreground">عدد الحلقات</div>
                    <div className="font-semibold text-lg">{teacher.circle_count || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">عدد الطلاب</div>
                    <div className="font-semibold text-lg">{teacher.student_count || 0}</div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-muted/50">
                  <Button variant="outline" size="sm" className="text-primary hover:text-primary">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(teacher.id)}>
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