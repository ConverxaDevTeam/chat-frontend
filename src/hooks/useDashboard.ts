import { useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardCard, DashboardState } from "../services/dashboardTypes";

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>(() =>
    dashboardService.getInitialState()
  );

  const updateCard = (cardId: string, updates: Partial<DashboardCard>) => {
    setState(currentState =>
      dashboardService.updateCard(currentState, cardId, updates)
    );
  };

  const addCard = (card: Omit<DashboardCard, "id">) => {
    setState(currentState => dashboardService.addCard(currentState, card));
  };

  const removeCard = (cardId: string) => {
    setState(currentState => dashboardService.removeCard(currentState, cardId));
  };

  const reorderCards = (cardIds: string[]) => {
    setState(currentState =>
      dashboardService.reorderCards(currentState, cardIds)
    );
  };

  return {
    state,
    updateCard,
    addCard,
    removeCard,
    reorderCards,
  };
};
