import { Card } from "@/components/ui/card";
import { Trophy, Award, Star, Flame, Zap, Crown } from "lucide-react";

interface DayData {
  date: string;
  total: number;
  entries: any[];
}

interface AchievementBadgesProps {
  currentIntake: number;
  dailyGoal: number;
  history: DayData[];
}

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}

export const AchievementBadges = ({ currentIntake, dailyGoal, history }: AchievementBadgesProps) => {
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
  const totalWater = history.reduce((sum, day) => sum + day.total, 0);

  const achievements: Achievement[] = [
    {
      id: "first-drop",
      icon: <Star className="w-6 h-6" />,
      title: "Первая капля",
      description: "Добавьте свою первую запись",
      unlocked: history.length > 0,
    },
    {
      id: "goal-reached",
      icon: <Trophy className="w-6 h-6" />,
      title: "Цель достигнута",
      description: "Выполните дневную норму",
      unlocked: currentIntake >= dailyGoal,
      progress: Math.min(100, (currentIntake / dailyGoal) * 100),
    },
    {
      id: "week-streak",
      icon: <Flame className="w-6 h-6" />,
      title: "Недельная серия",
      description: "7 дней подряд достигайте цели",
      unlocked: streak >= 7,
      progress: Math.min(100, (streak / 7) * 100),
    },
    {
      id: "hydration-master",
      icon: <Crown className="w-6 h-6" />,
      title: "Мастер гидратации",
      description: "30 дней достижения цели",
      unlocked: successfulDays >= 30,
      progress: Math.min(100, (successfulDays / 30) * 100),
    },
    {
      id: "liter-champion",
      icon: <Award className="w-6 h-6" />,
      title: "Чемпион литров",
      description: "Выпейте 100 литров",
      unlocked: totalWater >= 100000,
      progress: Math.min(100, (totalWater / 100000) * 100),
    },
    {
      id: "consistency",
      icon: <Zap className="w-6 h-6" />,
      title: "Постоянство",
      description: "Отслеживайте воду 14 дней подряд",
      unlocked: totalDays >= 14,
      progress: Math.min(100, (totalDays / 14) * 100),
    },
  ];

  return (
    <Card className="p-6 glass-effect">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full water-gradient flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">Достижения</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              achievement.unlocked
                ? 'border-primary bg-primary/5 water-shadow'
                : 'border-border/50 bg-muted/20 opacity-60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                achievement.unlocked
                  ? 'water-gradient text-white glow-effect'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {achievement.icon}
            </div>
            <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
            
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round(achievement.progress)}%
                </p>
              </div>
            )}
            
            {achievement.unlocked && (
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                ✓ Разблокировано
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
