import { useState, useEffect } from "react";
import { Droplet, Plus, TrendingUp, Award, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WaterStats } from "./WaterStats";
import { WaterHistory } from "./WaterHistory";
import { WaterSettings } from "./WaterSettings";
import { AchievementBadges } from "./AchievementBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

export const WaterTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [currentIntake, setCurrentIntake] = useState(0);
  const [history, setHistory] = useState<DayData[]>([]);
  const [selectedTab, setSelectedTab] = useState("tracker");

  // Load data from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem("waterGoal");
    const savedHistory = localStorage.getItem("waterHistory");
    
    if (savedGoal) setDailyGoal(parseInt(savedGoal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Get today's data
  useEffect(() => {
    const today = new Date().toDateString();
    const todayData = history.find(day => day.date === today);
    setCurrentIntake(todayData?.total || 0);
  }, [history]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("waterHistory", JSON.stringify(history));
  }, [history]);

  const addWater = (amount: number) => {
    const today = new Date().toDateString();
    const entry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const existingDay = prev.find(day => day.date === today);
      
      if (existingDay) {
        return prev.map(day => 
          day.date === today 
            ? { 
                ...day, 
                total: day.total + amount,
                entries: [...day.entries, entry]
              }
            : day
        );
      } else {
        return [...prev, { 
          date: today, 
          total: amount, 
          entries: [entry] 
        }];
      }
    });

    toast.success(`Добавлено ${amount} мл воды! 💧`, {
      description: `Прогресс: ${Math.min(100, Math.round(((currentIntake + amount) / dailyGoal) * 100))}%`
    });
  };

  const progressPercentage = Math.min(100, (currentIntake / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - currentIntake);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full water-gradient mb-4 glow-effect">
            <Droplet className="w-8 h-8 text-white wave-animation" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            AquaTrack
          </h1>
          <p className="text-muted-foreground">Следи за своей гидратацией</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-effect">
            <TabsTrigger value="tracker" className="data-[state=active]:water-gradient data-[state=active]:text-white">
              <Droplet className="w-4 h-4 mr-2" />
              Трекер
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:water-gradient data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:water-gradient data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:water-gradient data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Main Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6 glass-effect water-shadow">
              <div className="text-center mb-6">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  {/* Circular Progress */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#waterGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Droplet className="w-12 h-12 text-primary mb-2" />
                    <div className="text-3xl font-bold text-foreground">
                      {currentIntake}
                      <span className="text-lg text-muted-foreground ml-1">мл</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      из {dailyGoal} мл
                    </div>
                    <div className="text-xl font-semibold text-primary mt-1">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                </div>

                {remaining > 0 ? (
                  <p className="text-muted-foreground">
                    Осталось выпить <span className="font-semibold text-primary">{remaining} мл</span>
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-secondary">
                    🎉 Цель достигнута! Отличная работа!
                  </p>
                )}
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[250, 500, 750, 1000].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => addWater(amount)}
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:water-gradient hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105"
                  >
                    <Droplet className="w-5 h-5" />
                    <span className="font-semibold">{amount} мл</span>
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <Button
                onClick={() => {
                  const custom = prompt("Введите количество воды (мл):");
                  if (custom && !isNaN(parseInt(custom))) {
                    addWater(parseInt(custom));
                  }
                }}
                className="w-full mt-3 water-gradient hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добавить свой объём
              </Button>
            </Card>

            {/* Achievements */}
            <AchievementBadges currentIntake={currentIntake} dailyGoal={dailyGoal} history={history} />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <WaterStats history={history} dailyGoal={dailyGoal} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <WaterHistory history={history} setHistory={setHistory} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <WaterSettings 
              dailyGoal={dailyGoal} 
              setDailyGoal={setDailyGoal}
              history={history}
              setHistory={setHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
