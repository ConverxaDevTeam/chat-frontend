import { useEffect, useState } from "react";
import { DashboardCard, GridLayouts } from "../services/dashboardTypes";
import {
  updateCard as updateCardService,
  updateLayouts as updateLayoutsService,
  addCard as addCardService,
  removeCard as removeCardService,
  reorderCards as reorderCardsService,
  getCards,
} from "@services/dashboardService";
import { toast } from "react-toastify";

export const useDashboard = (organizationId: number | null) => {
  const [state, setState] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const initialState = await getCards(organizationId);
        setState(initialState);
      } catch (error) {
        console.error("Error loading cards:", error);
        toast.error("Error al cargar las tarjetas");
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [organizationId]);

  const updateCard = async (
    cardId: number,
    updates: Partial<DashboardCard>
  ) => {
    try {
      const updatedCard = await updateCardService(cardId, updates);
      setState(prev => ({
        ...prev,
        cards: prev.map(card => (card.id === cardId ? updatedCard : card)),
      }));
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Error al actualizar la tarjeta");
    }
  };

  const updateLayouts = async (layouts: GridLayouts, cardId: number) => {
    try {
      const updatedCards = await updateLayoutsService(cardId, layouts);
      setState(prev => ({
        ...prev,
        cards: updatedCards,
      }));
    } catch (error) {
      console.error("Error updating layouts:", error);
      toast.error("Error al actualizar el diseño");
    }
  };

  const addCard = async (card: Omit<DashboardCard, "id">) => {
    try {
      const newCard = await addCardService(organizationId, card);
      setState(prev => [...prev, newCard]);
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Error al agregar la tarjeta");
    }
  };

  const removeCard = async (cardId: number) => {
    try {
      await removeCardService(cardId);
      setState(prev => ({
        ...prev,
        cards: prev.filter(card => card.id !== cardId),
      }));
    } catch (error) {
      console.error("Error removing card:", error);
      toast.error("Error al eliminar la tarjeta");
    }
  };

  const reorderCards = async (cardIds: number[]) => {
    try {
      const updatedCards = await reorderCardsService(organizationId, cardIds);
      setState(prev => ({
        ...prev,
        cards: updatedCards,
      }));
    } catch (error) {
      console.error("Error reordering cards:", error);
      toast.error("Error al reordenar las tarjetas");
    }
  };

  return {
    state,
    loading,
    updateCard,
    updateLayouts,
    addCard,
    removeCard,
    reorderCards,
  };
};
