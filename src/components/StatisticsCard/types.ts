export type TimeRange = "1d" | "7d" | "30d" | "90d" | "180d" | "365d";

export const timeRangeLabels: Record<TimeRange, string> = {
  "1d": "Último día",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  "180d": "Últimos 6 meses",
  "365d": "Último año",
};
