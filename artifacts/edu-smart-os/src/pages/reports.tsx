import { useGetAiInsights } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reports() {
  const { data: aiInsights, isLoading } = useGetAiInsights();

  const getInsightIcon = (type: string, severity?: string | null) => {
    if (severity === "high") return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (type === "positive") return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    return <Lightbulb className="h-5 w-5 text-accent" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">التقارير وتحليلات الذكاء الاصطناعي</h1>
          <p className="text-muted-foreground mt-1">تحليل أداء المؤسسة ورؤى مستندة إلى البيانات</p>
        </div>
        <BrainCircuit className="h-10 w-10 text-primary opacity-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gold-500/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-secondary">
                <BrainCircuit className="h-6 w-6 text-primary" />
                رؤى الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : !aiInsights ? (
                <div className="text-center py-8 text-muted-foreground">لا توجد تحليلات متاحة حالياً</div>
              ) : (
                <div className="space-y-4">
                  {aiInsights.insights.map((insight, idx) => (
                    <div key={idx} className={cn(
                      "p-4 rounded-xl border flex gap-4 items-start",
                      insight.severity === "high" ? "bg-destructive/5 border-destructive/20" :
                      insight.type === "positive" ? "bg-green-50 border-green-200" :
                      "bg-card border-border"
                    )}>
                      <div className="mt-1 shrink-0">
                        {getInsightIcon(insight.type, insight.severity)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-secondary">التوصيات الاستراتيجية</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <ul className="space-y-3">
                  {aiInsights?.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-secondary">طلاب بحاجة إلى متابعة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {aiInsights?.weak_students?.map((student, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="font-semibold text-sm text-secondary">{student.name}</div>
                      <div className="text-xs text-destructive mt-1">{student.issue}</div>
                    </div>
                  )) || <div className="text-sm text-muted-foreground text-center py-4">لا يوجد طلاب ضمن هذه الفئة حالياً</div>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold-500/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg text-accent flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                تقارير جاهزة للطباعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-right p-3 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors text-sm font-medium">
                تقرير الحضور والغياب الشهري
              </button>
              <button className="w-full text-right p-3 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors text-sm font-medium">
                تقرير إنجاز الحفظ والمراجعة
              </button>
              <button className="w-full text-right p-3 rounded-lg bg-card border border-border hover:border-accent hover:text-accent transition-colors text-sm font-medium">
                الكشف المالي التفصيلي
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}