import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCreateSession, useListCircles, useListStudents, getListSessionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const PERFORMANCE_LABELS = ["ممتاز", "جيد جداً", "جيد", "مقبول", "ضعيف"];

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
}

interface StudentRecord {
  student_id: string;
  student_name: string;
  is_present: boolean;
  memorization_amount: string;
  revision_amount: string;
  next_memorization: string;
  next_revision: string;
  grade: string;
  performance_label: string;
  notes: string;
}

export function SessionModal({ open, onClose }: SessionModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createSession = useCreateSession();
  const { data: circles } = useListCircles();
  const { data: allStudents } = useListStudents({});

  const [step, setStep] = useState<"info" | "attendance">("info");
  const [form, setForm] = useState({
    circle_id: "",
    date: new Date().toISOString().split("T")[0],
    day: DAYS[new Date().getDay()],
    time: "",
    status: "مكتملة",
  });
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setStep("info"); setCreatedSessionId(null); }
  }, [open]);

  useEffect(() => {
    if (form.circle_id && allStudents) {
      const circleStudents = allStudents.filter(s => s.circle_id === form.circle_id);
      setRecords(circleStudents.map(s => ({
        student_id: s.id,
        student_name: s.full_name,
        is_present: true,
        memorization_amount: s.current_memorization ?? "",
        revision_amount: s.current_revision ?? "",
        next_memorization: "",
        next_revision: "",
        grade: "",
        performance_label: "",
        notes: "",
      })));
    }
  }, [form.circle_id, allStudents]);

  const setField = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const setRecord = (idx: number, key: keyof StudentRecord, val: unknown) => {
    setRecords(rs => rs.map((r, i) => i === idx ? { ...r, [key]: val } : r));
  };

  const handleCreateSession = async () => {
    if (!form.circle_id) { toast({ title: "يرجى اختيار الحلقة", variant: "destructive" }); return; }
    if (!form.date) { toast({ title: "يرجى تحديد التاريخ", variant: "destructive" }); return; }

    createSession.mutate({
      circle_id: form.circle_id,
      date: form.date,
      day: form.day || undefined,
      time: form.time || undefined,
      status: form.status,
    } as any, {
      onSuccess: (session: any) => {
        setCreatedSessionId(session.id);
        setStep("attendance");
      },
      onError: () => toast({ title: "حدث خطأ أثناء إنشاء الحصة", variant: "destructive" }),
    });
  };

  const handleSaveAttendance = async () => {
    if (!createdSessionId) return;

    try {
      const response = await fetch(`/api/sessions/${createdSessionId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: records.map(r => ({
            student_id: r.student_id,
            is_present: r.is_present,
            memorization_amount: r.memorization_amount || undefined,
            revision_amount: r.revision_amount || undefined,
            next_memorization: r.next_memorization || undefined,
            next_revision: r.next_revision || undefined,
            grade: r.grade ? parseInt(r.grade) : undefined,
            performance_label: r.performance_label || undefined,
            notes: r.notes || undefined,
          })),
        }),
      });

      if (response.ok) {
        toast({ title: "تم حفظ الحصة وسجلات الحضور بنجاح" });
        queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
        onClose();
      } else {
        toast({ title: "حدث خطأ أثناء حفظ سجلات الحضور", variant: "destructive" });
      }
    } catch {
      toast({ title: "حدث خطأ في الاتصال", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-secondary">
            {step === "info" ? "بدء حصة جديدة" : "تسجيل الحضور والحفظ"}
          </DialogTitle>
        </DialogHeader>

        {step === "info" ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full space-y-2">
                <Label>الحلقة <span className="text-destructive">*</span></Label>
                <Select value={form.circle_id} onValueChange={v => setField("circle_id", v)}>
                  <SelectTrigger><SelectValue placeholder="اختر الحلقة" /></SelectTrigger>
                  <SelectContent>{circles?.map(c => <SelectItem key={c.id} value={c.id}>{c.name} - {c.teacher_name || "بدون معلم"}</SelectItem>)}</SelectContent>
                </Select>
                {form.circle_id && (
                  <p className="text-sm text-muted-foreground">
                    سيتم تحميل {records.length} طالب من هذه الحلقة تلقائياً
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>تاريخ الحصة <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.date} onChange={e => setField("date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>اليوم</Label>
                <Select value={form.day} onValueChange={v => setField("day", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الوقت</Label>
                <Input type="time" value={form.time} onChange={e => setField("time", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>حالة الحصة</Label>
                <Select value={form.status} onValueChange={v => setField("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مكتملة">مكتملة</SelectItem>
                    <SelectItem value="ملغاة">ملغاة</SelectItem>
                    <SelectItem value="مؤجلة">مؤجلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={onClose}>إلغاء</Button>
              <Button onClick={handleCreateSession} disabled={createSession.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {createSession.isPending ? "جاري الإنشاء..." : "التالي: تسجيل الحضور"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-4 text-sm">
                <Badge className="bg-primary text-white">{records.filter(r => r.is_present).length} حاضر</Badge>
                <Badge variant="outline" className="text-destructive border-destructive">{records.filter(r => !r.is_present).length} غائب</Badge>
              </div>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا يوجد طلاب مسجلون في هذه الحلقة</div>
            ) : (
              <div className="space-y-4">
                {records.map((record, idx) => (
                  <div key={record.student_id} className={`border rounded-lg p-4 space-y-3 transition-colors ${record.is_present ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-secondary">{record.student_name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{record.is_present ? "حاضر" : "غائب"}</span>
                        <Switch checked={record.is_present} onCheckedChange={v => setRecord(idx, "is_present", v)} />
                      </div>
                    </div>
                    {record.is_present && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">الحفظ اليوم</Label>
                          <Input value={record.memorization_amount} onChange={e => setRecord(idx, "memorization_amount", e.target.value)} placeholder="ما حفظه اليوم" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">المراجعة اليوم</Label>
                          <Input value={record.revision_amount} onChange={e => setRecord(idx, "revision_amount", e.target.value)} placeholder="ما راجعه اليوم" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">حفظ المرة القادمة</Label>
                          <Input value={record.next_memorization} onChange={e => setRecord(idx, "next_memorization", e.target.value)} placeholder="للمرة القادمة" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">مراجعة المرة القادمة</Label>
                          <Input value={record.next_revision} onChange={e => setRecord(idx, "next_revision", e.target.value)} placeholder="للمرة القادمة" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الدرجة (0-100)</Label>
                          <Input type="number" value={record.grade} onChange={e => setRecord(idx, "grade", e.target.value)} placeholder="0" min={0} max={100} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">التقييم</Label>
                          <Select value={record.performance_label} onValueChange={v => setRecord(idx, "performance_label", v)}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="التقييم" /></SelectTrigger>
                            <SelectContent>{PERFORMANCE_LABELS.map(l => <SelectItem key={l} value={l} className="text-sm">{l}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setStep("info")}>السابق</Button>
              <Button onClick={handleSaveAttendance} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                حفظ الحصة والحضور
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
