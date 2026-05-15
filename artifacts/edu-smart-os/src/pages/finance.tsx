import { useState } from "react";
import { useGetFinanceSummary, useListInvoices, useListExpenses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp, TrendingDown, FileText, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Finance() {
  const [activeTab, setActiveTab] = useState("summary");
  
  const { data: summary, isLoading: isLoadingSummary } = useGetFinanceSummary();
  const { data: invoices, isLoading: isLoadingInvoices } = useListInvoices();
  const { data: expenses, isLoading: isLoadingExpenses } = useListExpenses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">الشؤون المالية</h1>
          <p className="text-muted-foreground mt-1">الإيرادات والمصروفات والاشتراكات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-destructive hover:bg-destructive/10">
            <Plus className="ml-2 h-4 w-4" />
            إضافة مصروف
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="ml-2 h-4 w-4" />
            إصدار فاتورة
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 p-1">
          <TabsTrigger value="summary">الملخص المالي</TabsTrigger>
          <TabsTrigger value="invoices">الاشتراكات والفواتير</TabsTrigger>
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6 space-y-6">
          {isLoadingSummary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gold-500/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-primary">إجمالي الإيرادات</CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{summary.revenue} ج.م</div>
                </CardContent>
              </Card>
              <Card className="border-gold-500/20 bg-destructive/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-destructive">إجمالي المصروفات</CardTitle>
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{summary.expenses} ج.م</div>
                </CardContent>
              </Card>
              <Card className="border-gold-500/20 bg-accent/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-accent">صافي الربح</CardTitle>
                  <Wallet className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{summary.profit} ج.م</div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card className="border-gold-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-secondary">
                <FileText className="h-5 w-5 text-primary" />
                سجل الفواتير
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : !invoices?.length ? (
                <div className="text-center py-12 text-muted-foreground">لا توجد فواتير مسجلة</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-muted-foreground bg-muted/50 uppercase">
                      <tr>
                        <th className="px-4 py-3 rounded-tr-lg">رقم الفاتورة</th>
                        <th className="px-4 py-3">الطالب</th>
                        <th className="px-4 py-3">الشهر</th>
                        <th className="px-4 py-3">المبلغ</th>
                        <th className="px-4 py-3">الحالة</th>
                        <th className="px-4 py-3 rounded-tl-lg text-left">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-muted hover:bg-muted/20">
                          <td className="px-4 py-3 text-muted-foreground">#{inv.id.slice(0, 8)}</td>
                          <td className="px-4 py-3 font-medium">{inv.student_name}</td>
                          <td className="px-4 py-3">{inv.month}</td>
                          <td className="px-4 py-3 font-bold">{inv.amount} ج.م</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={
                              inv.status === "مدفوع" ? "text-green-600 border-green-600" :
                              inv.status === "غير مدفوع" ? "text-destructive border-destructive" :
                              "text-muted-foreground"
                            }>{inv.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-left">
                            <Button variant="ghost" size="sm" className="text-primary">التفاصيل</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card className="border-gold-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-secondary">
                <Receipt className="h-5 w-5 text-destructive" />
                سجل المصروفات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingExpenses ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : !expenses?.length ? (
                <div className="text-center py-12 text-muted-foreground">لا توجد مصروفات مسجلة</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-muted-foreground bg-muted/50 uppercase">
                      <tr>
                        <th className="px-4 py-3 rounded-tr-lg">التاريخ</th>
                        <th className="px-4 py-3">التصنيف</th>
                        <th className="px-4 py-3">الوصف</th>
                        <th className="px-4 py-3">المبلغ</th>
                        <th className="px-4 py-3 rounded-tl-lg"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="border-b border-muted hover:bg-muted/20">
                          <td className="px-4 py-3 text-muted-foreground" dir="ltr">{new Date(exp.date).toLocaleDateString('ar-EG')}</td>
                          <td className="px-4 py-3 font-medium">{exp.category}</td>
                          <td className="px-4 py-3">{exp.description || "-"}</td>
                          <td className="px-4 py-3 font-bold text-destructive">{exp.amount} ج.م</td>
                          <td className="px-4 py-3 text-left">
                            <Button variant="ghost" size="sm" className="text-primary">تعديل</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}