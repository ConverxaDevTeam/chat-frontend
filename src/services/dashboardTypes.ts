import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";

interface BaseLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CardLayout extends BaseLayout {
  i: number;
}

interface GridLayout extends BaseLayout {
  i: string;
}

interface CardLayouts {
  lg: CardLayout;
  md?: CardLayout;
  sm?: CardLayout;
  xs?: CardLayout;
}

interface GridLayouts {
  lg: GridLayout[];
  md?: GridLayout[];
  sm?: GridLayout[];
  xs?: GridLayout[];
}

export interface DashboardCard {
  id: number;
  title: string;
  analyticTypes: AnalyticType[];
  displayType: StatisticsDisplayType;
  timeRange: TimeRange;
  layout: CardLayouts;
  showLegend?: boolean;
}

export type { GridLayout, GridLayouts };

export interface DashboardState {
  cards: DashboardCard[];
  nextId: number;
}
