import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Droplet } from "lucide-react";
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

interface WaterHistoryProps {
  history: DayData[];
  setHistory: (history: DayData[]) => void;
}

export const WaterHistory = ({ history, setHistory }: WaterHistoryProps) => {
  const deleteEntry = (date: string, entryId: string) => {
    setHistory(
      history.map(day => {
        if (day.date === date) {
          const newEntries = day.entries.filter(entry => entry.id !== entryId);
          const newTotal = newEntries.reduce((sum, entry) => sum + entry.amount, 0);
          return { ...day, entries: newEntries, total: newTotal };
        }
        return day;
      }).filter(day => day.entries.length > 0)
    );
    toast.success("Запись удалена");
  };

  const clearAllHistory = () => {
    if (window.confirm("Вы уверены, что хотите удалить всю историю?")) {
      setHistory([]);
      localStorage.removeItem("waterHistory");
      toast.success("История очищена");
    }
  };

  const sortedHistory = [...history].reverse();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">История приёмов воды</h2>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllHistory}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить всё
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="p-12 glass-effect text-center">
          <Droplet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">История пуста</p>
          <p className="text-sm text-muted-foreground mt-2">
            Начните отслеживать потребление воды!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((day) => {
            const date = new Date(day.date);
            const isToday = day.date === new Date().toDateString();
            const dateStr = isToday
              ? "Сегодня"
              : date.toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });

            return (
              <Card key={day.date} className="p-6 glass-effect">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">{dateStr}</h3>
                    <p className="text-sm text-muted-foreground">
                      Всего: <span className="font-semibold text-primary">{day.total} мл</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Записей</div>
                    <div className="text-2xl font-bold text-secondary">{day.entries.length}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {day.entries.map((entry) => {
                    const time = new Date(entry.timestamp).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{entry.amount} мл</div>
                            <div className="text-xs text-muted-foreground">{time}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEntry(day.date, entry.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
