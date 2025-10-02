import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Target, Bell, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface DayData {
  date: string;
  total: number;
  entries: any[];
}

interface WaterSettingsProps {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  history: DayData[];
  setHistory: (history: DayData[]) => void;
}

export const WaterSettings = ({ dailyGoal, setDailyGoal, history, setHistory }: WaterSettingsProps) => {
  const [tempGoal, setTempGoal] = useState(dailyGoal.toString());
  const [useMetric, setUseMetric] = useState(true);
  const [reminders, setReminders] = useState(false);

  const saveGoal = () => {
    const newGoal = parseInt(tempGoal);
    if (newGoal > 0 && newGoal <= 10000) {
      setDailyGoal(newGoal);
      localStorage.setItem("waterGoal", newGoal.toString());
      toast.success("Цель обновлена!");
    } else {
      toast.error("Введите корректное значение (1-10000 мл)");
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ history, dailyGoal }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aquatrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("Данные экспортированы!");
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.history && data.dailyGoal) {
            setHistory(data.history);
            setDailyGoal(data.dailyGoal);
            setTempGoal(data.dailyGoal.toString());
            localStorage.setItem("waterGoal", data.dailyGoal.toString());
            localStorage.setItem("waterHistory", JSON.stringify(data.history));
            toast.success("Данные импортированы!");
          } else {
            toast.error("Неверный формат файла");
          }
        } catch (error) {
          toast.error("Ошибка чтения файла");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Goal */}
      <Card className="p-6 glass-effect">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full water-gradient flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Ежедневная цель</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="goal">Цель (мл)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="goal"
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="flex-1"
                min="500"
                max="10000"
                step="100"
              />
              <Button onClick={saveGoal} className="water-gradient">
                Сохранить
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Рекомендуется: 2000-3000 мл в день
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1500, 2000, 2500, 3000].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setTempGoal(preset.toString())}
                className="hover:water-gradient hover:text-white"
              >
                {preset} мл
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Units */}
      <Card className="p-6 glass-effect">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Единицы измерения</h3>
            <p className="text-sm text-muted-foreground">
              {useMetric ? "Миллилитры (мл)" : "Унции (oz)"}
            </p>
          </div>
          <Switch
            checked={useMetric}
            onCheckedChange={setUseMetric}
          />
        </div>
      </Card>

      {/* Reminders */}
      <Card className="p-6 glass-effect">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full water-gradient flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Напоминания</h3>
              <p className="text-sm text-muted-foreground">
                Напоминания о питье воды
              </p>
            </div>
          </div>
          <Switch
            checked={reminders}
            onCheckedChange={setReminders}
          />
        </div>
        
        {reminders && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              💡 Для полноценных push-уведомлений необходимо разрешение браузера
            </p>
          </div>
        )}
      </Card>

      {/* Data Management */}
      <Card className="p-6 glass-effect">
        <h3 className="font-semibold mb-4">Управление данными</h3>
        <div className="space-y-3">
          <Button
            onClick={exportData}
            variant="outline"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспортировать данные
          </Button>

          <div>
            <input
              type="file"
              id="import-file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('import-file')?.click()}
              variant="outline"
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Импортировать данные
            </Button>
          </div>

          <Button
            onClick={() => {
              if (window.confirm("Удалить все данные? Это действие нельзя отменить!")) {
                setHistory([]);
                localStorage.removeItem("waterHistory");
                toast.success("Все данные удалены");
              }
            }}
            variant="outline"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить все данные
          </Button>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-6 glass-effect bg-primary/5">
        <h3 className="font-semibold mb-2">💧 О приложении</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AquaTrack помогает отслеживать ежедневное потребление воды. 
          Поддерживайте водный баланс для здоровья и хорошего самочувствия!
        </p>
      </Card>
    </div>
  );
};
