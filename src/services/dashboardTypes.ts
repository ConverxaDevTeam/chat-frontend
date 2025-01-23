import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Layouts {
  lg: Layout;
  md?: Layout;
  sm?: Layout;
  xs?: Layout;
}

export interface DashboardCard {
  id: string;
  title: string;
  analyticType: AnalyticType;
  displayType: StatisticsDisplayType;
  timeRange: TimeRange;
  layout: Layouts;
}

export interface DashboardState {
  cards: DashboardCard[];
  nextId: number;
}
