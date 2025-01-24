import { useState } from "react";
import {
  DashboardCard,
  DashboardState,
  GridLayouts,
} from "../services/dashboardTypes";
import {
  getInitialState,
  updateCard as updateCardService,
  updateLayouts as updateLayoutsService,
  addCard as addCardService,
  removeCard as removeCardService,
  reorderCards as reorderCardsService,
} from "@services/dashboardService";

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>(getInitialState());

  const updateCard = (cardId: number, updates: Partial<DashboardCard>) => {
    setState(updateCardService(state, cardId, updates));
  };

  const updateLayouts = (layouts: GridLayouts) => {
    setState(updateLayoutsService(state, layouts));
  };

  const addCard = (card: Omit<DashboardCard, "id">) => {
    setState(addCardService(state, card));
  };

  const removeCard = (cardId: number) => {
    setState(removeCardService(state, cardId));
  };

  const reorderCards = (cardIds: number[]) => {
    setState(reorderCardsService(state, cardIds));
  };

  return {
    state,
    updateCard,
    updateLayouts,
    addCard,
    removeCard,
    reorderCards,
  };
};
