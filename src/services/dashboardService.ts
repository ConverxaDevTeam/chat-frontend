import { DashboardCard, DashboardState } from "./dashboardTypes";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "./analyticTypes";

const DASHBOARD_STORAGE_KEY = "dashboard_state";

const defaultCards: DashboardCard[] = [
  {
    id: 1,
    title: "Usuarios",
    analyticType: AnalyticType.TOTAL_USERS,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 1,
        x: 0,
        y: 0,
        w: 18,
        h: 6,
      },
    },
    showLegend: true,
  },
  {
    id: 2,
    title: "Mensajes",
    analyticType: AnalyticType.TOTAL_MESSAGES,
    displayType: StatisticsDisplayType.AREA,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: {
      lg: {
        i: 2,
        x: 18,
        y: 0,
        w: 18,
        h: 6,
      },
    },
    showLegend: true,
  },
  {
    id: 3,
    title: "Avg. Mensajes IA por sesión",
    analyticType: AnalyticType.AVG_IA_MESSAGES_PER_SESSION,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 3,
        x: 0,
        y: 6,
        w: 9,
        h: 6,
      },
    },
  },
  {
    id: 4,
    title: "Avg. Mensajes HITL por sesión",
    analyticType: AnalyticType.AVG_HITL_MESSAGES_PER_SESSION,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 4,
        x: 9,
        y: 6,
        w: 9,
        h: 6,
      },
    },
  },
  {
    id: 5,
    title: "Avg. Sesiones por usuario",
    analyticType: AnalyticType.AVG_SESSIONS_PER_USER,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 5,
        x: 18,
        y: 6,
        w: 9,
        h: 6,
      },
    },
  },
  {
    id: 6,
    title: "Mensajes por canal",
    analyticType: AnalyticType.MESSAGES_BY_CHANNEL,
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 6,
        x: 27,
        y: 6,
        w: 9,
        h: 6,
      },
    },
  },
  {
    id: 7,
    title: "Funciones",
    analyticType: AnalyticType.FUNCTIONS_PER_SESSION,
    displayType: StatisticsDisplayType.AREA,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: {
      lg: {
        i: 7,
        x: 0,
        y: 12,
        w: 36,
        h: 6,
      },
    },
    showLegend: true,
  },
  {
    id: 8,
    title: "Distribución por canal",
    analyticType: AnalyticType.MESSAGES_BY_CHANNEL,
    displayType: StatisticsDisplayType.PIE,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        i: 8,
        x: 0,
        y: 18,
        w: 12,
        h: 9,
      },
    },
    showLegend: true,
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
    cardId: number,
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
      id: state.nextId,
    };

    const newState = {
      ...state,
      cards: [...state.cards, newCard],
      nextId: state.nextId + 1,
    };
    updateState(newState);
    return newState;
  },

  removeCard: (state: DashboardState, cardId: number): DashboardState => {
    const newState = {
      ...state,
      cards: state.cards.filter(card => card.id !== cardId),
    };
    updateState(newState);
    return newState;
  },

  reorderCards: (state: DashboardState, cardIds: number[]): DashboardState => {
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
