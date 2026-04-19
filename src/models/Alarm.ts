export interface Alarm {
  id: string;
  label: string;
  miTimeHour: number;   // 0–23 in solar time
  miTimeMinute: number; // 0–59
  enabled: boolean;
}
