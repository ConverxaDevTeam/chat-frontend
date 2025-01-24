import {
  DashboardCard,
  DashboardState,
  GridLayouts,
  GridLayout,
} from "./dashboardTypes";
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
    analyticTypes: [
      AnalyticType.RECURRING_USERS,
      AnalyticType.TOTAL_USERS,
      AnalyticType.NEW_USERS,
    ],
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_90_DAYS,
    layout: {
      lg: {
        w: 18,
        h: 6,
        x: 0,
        y: 0,
        i: 1,
      },
      md: {
        w: 14,
        h: 6,
        x: 0,
        y: 0,
        i: 1,
      },
      sm: {
        w: 18,
        h: 6,
        x: 0,
        y: 0,
        i: 1,
      },
      xs: {
        w: 12,
        h: 6,
        x: 0,
        y: 0,
        i: 1,
      },
    },
    showLegend: true,
  },
  {
    id: 2,
    title: "Mensajes",
    analyticTypes: [AnalyticType.IA_MESSAGES, AnalyticType.HITL_MESSAGES],
    displayType: StatisticsDisplayType.AREA,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: {
      lg: {
        w: 18,
        h: 6,
        x: 18,
        y: 0,
        i: 2,
      },
      md: {
        w: 15,
        h: 6,
        x: 15,
        y: 0,
        i: 2,
      },
      sm: {
        w: 18,
        h: 6,
        x: 0,
        y: 6,
        i: 2,
      },
      xs: {
        w: 12,
        h: 6,
        x: 0,
        y: 6,
        i: 2,
      },
    },
    showLegend: true,
  },
  {
    id: 3,
    title: "Avg. Mensajes IA por sesión",
    analyticTypes: [AnalyticType.AVG_IA_MESSAGES_PER_SESSION],
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        w: 9,
        h: 5,
        x: 0,
        y: 6,
        i: 3,
      },
      md: {
        w: 9,
        h: 5,
        x: 0,
        y: 6,
        i: 3,
      },
      sm: {
        w: 6,
        h: 4,
        x: 0,
        y: 12,
        i: 3,
      },
      xs: {
        w: 12,
        h: 4,
        x: 0,
        y: 12,
        i: 3,
      },
    },
  },
  {
    id: 4,
    title: "Avg. Mensajes HITL por sesión",
    analyticTypes: [AnalyticType.AVG_HITL_MESSAGES_PER_SESSION],
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        w: 9,
        h: 5,
        x: 9,
        y: 11,
        i: 4,
      },
      md: {
        w: 9,
        h: 5,
        x: 9,
        y: 6,
        i: 4,
      },
      sm: {
        w: 9,
        h: 4,
        x: 9,
        y: 20,
        i: 4,
      },
      xs: {
        w: 12,
        h: 4,
        x: 0,
        y: 24,
        i: 4,
      },
    },
  },
  {
    id: 5,
    title: "Avg. Sesiones por usuario",
    analyticTypes: [AnalyticType.AVG_SESSIONS_PER_USER],
    displayType: StatisticsDisplayType.METRIC,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        w: 9,
        h: 5,
        x: 9,
        y: 6,
        i: 5,
      },
      md: {
        w: 9,
        h: 5,
        x: 0,
        y: 11,
        i: 5,
      },
      sm: {
        w: 6,
        h: 4,
        x: 0,
        y: 16,
        i: 5,
      },
      xs: {
        w: 12,
        h: 4,
        x: 0,
        y: 28,
        i: 5,
      },
    },
  },
  {
    id: 6,
    title: "Mensajes por canal",
    analyticTypes: [
      AnalyticType.MESSAGES_BY_WHATSAPP,
      AnalyticType.MESSAGES_BY_FACEBOOK,
      AnalyticType.MESSAGES_BY_WEB,
    ],
    displayType: StatisticsDisplayType.PIE,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        w: 9,
        h: 5,
        x: 0,
        y: 11,
        i: 6,
      },
      md: {
        w: 9,
        h: 5,
        x: 9,
        y: 11,
        i: 6,
      },
      sm: {
        w: 9,
        h: 4,
        x: 0,
        y: 20,
        i: 6,
      },
      xs: {
        w: 9,
        h: 4,
        x: 3,
        y: 32,
        i: 6,
      },
    },
    showLegend: false,
  },
  {
    id: 7,
    title: "Funciones",
    analyticTypes: [AnalyticType.FUNCTIONS_PER_SESSION],
    displayType: StatisticsDisplayType.BAR,
    timeRange: TimeRange.LAST_7_DAYS,
    layout: {
      lg: {
        w: 36,
        h: 6,
        x: 0,
        y: 16,
        i: 7,
      },
      md: {
        w: 30,
        h: 6,
        x: 0,
        y: 16,
        i: 7,
      },
      sm: {
        w: 18,
        h: 6,
        x: 0,
        y: 24,
        i: 7,
      },
      xs: {
        w: 12,
        h: 6,
        x: 0,
        y: 36,
        i: 7,
      },
    },
    showLegend: true,
  },
  {
    id: 8,
    title: "Distribución por canal",
    analyticTypes: [
      AnalyticType.MESSAGES_BY_WHATSAPP,
      AnalyticType.MESSAGES_BY_FACEBOOK,
      AnalyticType.MESSAGES_BY_WEB,
    ],
    displayType: StatisticsDisplayType.PIE,
    timeRange: TimeRange.LAST_30_DAYS,
    layout: {
      lg: {
        w: 12,
        h: 10,
        x: 24,
        y: 6,
        i: 8,
      },
      md: {
        w: 12,
        h: 10,
        x: 18,
        y: 6,
        i: 8,
      },
      sm: {
        w: 12,
        h: 8,
        x: 6,
        y: 12,
        i: 8,
      },
      xs: {
        w: 12,
        h: 8,
        x: 0,
        y: 16,
        i: 8,
      },
    },
    showLegend: true,
  },
];

export const getInitialState = (): DashboardState => {
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

export const updateCard = (
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
};

export const updateLayouts = (
  state: DashboardState,
  layouts: GridLayouts
): DashboardState => {
  const newState = {
    ...state,
    cards: state.cards.map(card => {
      const updatedLayout = { ...card.layout };

      Object.entries(layouts).forEach(([breakpoint, layoutArray]) => {
        const layout = layoutArray?.find(
          (l: GridLayout) => Number(l.i) === card.id
        );
        if (layout) {
          updatedLayout[breakpoint as keyof GridLayouts] = {
            ...layout,
            i: card.id,
          };
        }
      });

      return {
        ...card,
        layout: updatedLayout,
      };
    }),
  };
  updateState(newState);
  return newState;
};

export const addCard = (
  state: DashboardState,
  card: Omit<DashboardCard, "id">
): DashboardState => {
  const newState = {
    ...state,
    cards: [...state.cards, { ...card, id: state.nextId }],
    nextId: state.nextId + 1,
  };
  updateState(newState);
  return newState;
};

export const removeCard = (
  state: DashboardState,
  cardId: number
): DashboardState => {
  const newState = {
    ...state,
    cards: state.cards.filter(card => card.id !== cardId),
  };
  updateState(newState);
  return newState;
};

export const reorderCards = (
  state: DashboardState,
  cardIds: number[]
): DashboardState => {
  const newState = {
    ...state,
    cards: cardIds
      .map(id => state.cards.find(card => card.id === id))
      .filter((card): card is DashboardCard => card !== undefined),
  };
  updateState(newState);
  return newState;
};
