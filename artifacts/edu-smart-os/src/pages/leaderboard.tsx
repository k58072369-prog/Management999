import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-2">
          <Trophy className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-4xl font-bold text-secondary">لوحة الشرف والصدارة</h1>
        <p className="text-lg text-muted-foreground">أفضل الطلاب أداءً والتزاماً خلال هذا الشهر</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : !leaderboard?.length ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border max-w-4xl mx-auto">
          لا توجد بيانات متاحة للوحة الصدارة
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {leaderboard.map((entry, index) => {
            const isTop3 = index < 3;
            const rankIcon = 
              index === 0 ? <Award className="h-8 w-8 text-yellow-500" /> :
              index === 1 ? <Award className="h-8 w-8 text-gray-400" /> :
              index === 2 ? <Award className="h-8 w-8 text-amber-700" /> :
              <span className="text-lg font-bold text-muted-foreground w-8 text-center">{index + 1}</span>;

            return (
              <Card 
                key={entry.student_id} 
                className={cn(
                  "border overflow-hidden transition-all duration-300 hover:scale-[1.01]",
                  index === 0 ? "border-yellow-500 bg-yellow-500/5 shadow-yellow-500/10 shadow-lg" : 
                  index === 1 ? "border-gray-400 bg-gray-400/5" :
                  index === 2 ? "border-amber-700 bg-amber-700/5" :
                  "border-border bg-card hover:border-primary/30"
                )}
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4 gap-4">
                    <div className="flex items-center justify-center w-12 shrink-0">
                      {rankIcon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-bold truncate", isTop3 ? "text-lg text-secondary" : "text-base")}>
                          {entry.student_name}
                        </h3>
                        {entry.is_student_of_month && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground">
                            <Star className="h-3 w-3 ml-1 fill-current" />
                            طالب الشهر
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate mt-1">
                        {entry.circle_name || "حلقة غير محددة"}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden sm:flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">الحضور</span>
                        <span className="font-semibold text-sm">{entry.attendance_score}%</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">الحفظ</span>
                        <span className="font-semibold text-sm">{entry.memorization_score}%</span>
                      </div>
                      <div className="bg-primary/10 px-4 py-2 rounded-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-xs font-medium text-primary">النقاط</span>
                        <span className="text-xl font-bold text-primary">{entry.points}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}