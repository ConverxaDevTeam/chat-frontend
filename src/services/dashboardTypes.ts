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

export interface CardLayout extends BaseLayout {
  i: number;
}

interface CardLayouts {
  lg: CardLayout;
  md?: CardLayout;
  sm?: CardLayout;
  xs?: CardLayout;
}

interface GridLayouts {
  lg: CardLayout[];
  md?: CardLayout[];
  sm?: CardLayout[];
  xs?: CardLayout[];
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

export type { GridLayouts, CardLayouts };

export interface CreateDashboardDto extends Omit<DashboardCard, "id"> {
  organizationId: number;
}
