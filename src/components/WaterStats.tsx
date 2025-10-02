import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

interface WaterEntry {
  id: string;
  amount: number;
  timestamp: number;
}

interface DayData {
  date: string;
  total: number;
  entries: WaterEntry[];
}

interface WaterStatsProps {
  history: DayData[];
  dailyGoal: number;
}

export const WaterStats = ({ history, dailyGoal }: WaterStatsProps) => {
  // Calculate weekly average
  const last7Days = history.slice(-7);
  const weeklyAverage = last7Days.length > 0
    ? Math.round(last7Days.reduce((sum, day) => sum + day.total, 0) / last7Days.length)
    : 0;

  // Calculate monthly average
  const last30Days = history.slice(-30);
  const monthlyAverage = last30Days.length > 0
    ? Math.round(last30Days.reduce((sum, day) => sum + day.total, 0) / last30Days.length)
    : 0;

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].reverse();
    
    for (const day of sortedHistory) {
      if (day.total >= dailyGoal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const totalDays = history.length;
  const successfulDays = history.filter(day => day.total >= dailyGoal).length;
  const successRate = totalDays > 0 ? Math.round((successfulDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 glass-effect">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full water-gradient flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">За неделю</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{weeklyAverage} мл</div>
          <p className="text-sm text-muted-foreground">Средний объём</p>
        </Card>

        <Card className="p-6 glass-effect">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full water-gradient flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">За месяц</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{monthlyAverage} мл</div>
          <p className="text-sm text-muted-foreground">Средний объём</p>
        </Card>

        <Card className="p-6 glass-effect">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full water-gradient flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">Серия</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{streak} дней</div>
          <p className="text-sm text-muted-foreground">Текущая серия</p>
        </Card>
      </div>

      {/* Success Rate */}
      <Card className="p-6 glass-effect water-shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Процент выполнения цели
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Успешных дней</span>
              <span className="text-sm font-semibold text-foreground">
                {successfulDays} из {totalDays}
              </span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full water-gradient transition-all duration-1000 ease-out"
                style={{ width: `${successRate}%` }}
              />
            </div>
            <div className="text-right mt-2">
              <span className="text-2xl font-bold text-primary">{successRate}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Chart */}
      <Card className="p-6 glass-effect">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Последние 7 дней
        </h3>
        <div className="space-y-3">
          {last7Days.reverse().map((day, index) => {
            const percentage = Math.min(100, (day.total / dailyGoal) * 100);
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{dayName}, {dateStr}</span>
                  <span className="text-sm text-muted-foreground">{day.total} мл</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentage >= 100 ? 'water-gradient' : 'bg-primary/50'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 glass-effect text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {history.reduce((sum, day) => sum + day.total, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Всего выпито (мл)</p>
        </Card>

        <Card className="p-6 glass-effect text-center">
          <div className="text-3xl font-bold text-secondary mb-1">
            {history.reduce((sum, day) => sum + day.entries.length, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Всего записей</p>
        </Card>
      </div>
    </div>
  );
};
