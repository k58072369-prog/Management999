import { useState } from "react";
import { useListStudents, getListStudentsQueryKey, useCreateStudent, useDeleteStudent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const [search, setSearch] = useState("");
  const { data: students, isLoading } = useListStudents({ search });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteStudent = useDeleteStudent();

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطالب؟")) {
      deleteStudent.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم حذف الطالب بنجاح" });
          queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
        },
        onError: () => {
          toast({ title: "حدث خطأ أثناء الحذف", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">الطلاب</h1>
          <p className="text-muted-foreground mt-1">إدارة بيانات طلاب الحلقات</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="ml-2 h-4 w-4" />
          إضافة طالب
        </Button>
      </div>

      <Card className="border-gold-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="البحث باسم الطالب..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : !students?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              لا يوجد طلاب متاحين
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-muted-foreground bg-muted/50 uppercase">
                  <tr>
                    <th className="px-4 py-3 rounded-tr-lg">الاسم</th>
                    <th className="px-4 py-3">المرحلة</th>
                    <th className="px-4 py-3">الحلقة</th>
                    <th className="px-4 py-3">رقم ولي الأمر</th>
                    <th className="px-4 py-3 rounded-tl-lg text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-muted hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{student.full_name}</td>
                      <td className="px-4 py-3">{student.grade}</td>
                      <td className="px-4 py-3">{student.circle_name || "غير محدد"}</td>
                      <td className="px-4 py-3">{student.guardian_phone}</td>
                      <td className="px-4 py-3 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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