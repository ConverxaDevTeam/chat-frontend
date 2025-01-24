import { useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardCard, DashboardState } from "../services/dashboardTypes";

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>(
    dashboardService.getInitialState()
  );

  const updateCard = (cardId: number, updates: Partial<DashboardCard>) => {
    setState(dashboardService.updateCard(state, cardId, updates));
  };

  const addCard = (card: Omit<DashboardCard, "id">) => {
    setState(dashboardService.addCard(state, card));
  };

  const removeCard = (cardId: number) => {
    setState(dashboardService.removeCard(state, cardId));
  };

  const reorderCards = (cardIds: number[]) => {
    setState(dashboardService.reorderCards(state, cardIds));
  };

  return {
    state,
    updateCard,
    addCard,
    removeCard,
    reorderCards,
  };
};
