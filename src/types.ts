export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
}

export interface UserStats {
  dailyGoal: number; // in ml
  logs: WaterLog[];
}

export interface ReminderSettings {
  enabled: boolean;
  interval: number; // in minutes
  startHour: number; // 0-23
  endHour: number; // 0-23
}
