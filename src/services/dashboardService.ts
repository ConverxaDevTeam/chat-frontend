import { DashboardCard, DashboardState } from "./dashboardTypes";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";

const DASHBOARD_STORAGE_KEY = "dashboard_state";

const defaultCards: DashboardCard[] = [
  {
    id: "users",
    title: "Usuarios",
    analyticType: AnalyticType.TOTAL_USERS,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "users", x: 0, y: 0, w: 6, h: 2 } },
  },
  {
    id: "messages",
    title: "Mensajes",
    analyticType: AnalyticType.TOTAL_MESSAGES,
    displayType: StatisticsDisplayType.AREA,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: { lg: { i: "messages", x: 6, y: 0, w: 6, h: 2 } },
  },
  {
    id: "iaMessages",
    title: "Avg. Mensajes IA por sesión",
    analyticType: AnalyticType.AVG_IA_MESSAGES_PER_SESSION,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "iaMessages", x: 0, y: 2, w: 3, h: 2 } },
  },
  {
    id: "htlMessages",
    title: "Avg. Mensajes HITL por sesión",
    analyticType: AnalyticType.AVG_HITL_MESSAGES_PER_SESSION,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "htlMessages", x: 3, y: 2, w: 3, h: 2 } },
  },
  {
    id: "sessions",
    title: "Avg. Sesiones por usuario",
    analyticType: AnalyticType.AVG_SESSIONS_PER_USER,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "sessions", x: 6, y: 2, w: 3, h: 2 } },
  },
  {
    id: "channels",
    title: "Mensajes por canal",
    analyticType: AnalyticType.MESSAGES_BY_CHANNEL,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "channels", x: 9, y: 2, w: 3, h: 2 } },
  },
  {
    id: "functions",
    title: "Funciones",
    analyticType: AnalyticType.FUNCTIONS_PER_SESSION,
    displayType: StatisticsDisplayType.AREA,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: { lg: { i: "functions", x: 0, y: 4, w: 12, h: 2 } },
  },
  {
    id: "channels-pie",
    title: "Distribución por canal",
    analyticType: AnalyticType.MESSAGES_BY_CHANNEL,
    displayType: StatisticsDisplayType.PIE,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: { lg: { i: "channels-pie", x: 0, y: 6, w: 4, h: 3 } },
  },
];

const getInitialState = (): DashboardState => {
  const storedState = localStorage.getItem(DASHBOARD_STORAGE_KEY);
  if (storedState) {
    return JSON.parse(storedState);
  }

  const initialState: DashboardState = {
    cards: defaultCards,
    nextId: defaultCards.length + 1,
  };

  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
};

const updateState = (state: DashboardState): void => {
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(state));
};

export const dashboardService = {
  getInitialState,
  updateState,
  updateCard: (
    state: DashboardState,
    cardId: string,
    updates: Partial<DashboardCard>
  ): DashboardState => {
    const newState = {
      ...state,
      cards: state.cards.map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      ),
    };
    updateState(newState);
    return newState;
  },

  addCard: (
    state: DashboardState,
    card: Omit<DashboardCard, "id">
  ): DashboardState => {
    const newCard = {
      ...card,
      id: `card-${state.nextId}`,
    };

    const newState = {
      ...state,
      cards: [...state.cards, newCard],
      nextId: state.nextId + 1,
    };
    updateState(newState);
    return newState;
  },

  removeCard: (state: DashboardState, cardId: string): DashboardState => {
    const newState = {
      ...state,
      cards: state.cards.filter(card => card.id !== cardId),
    };
    updateState(newState);
    return newState;
  },

  reorderCards: (state: DashboardState, cardIds: string[]): DashboardState => {
    const newState = {
      ...state,
      cards: cardIds
        .map(id => state.cards.find(card => card.id === id))
        .filter((card): card is DashboardCard => card !== undefined),
    };
    updateState(newState);
    return newState;
  },
};
