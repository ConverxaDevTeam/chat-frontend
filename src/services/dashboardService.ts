import { DashboardCard, GridLayouts } from "./dashboardTypes";
import { axiosInstance } from "@store/actions/auth";
import { apiUrls } from "@/config/config";

export const getCards = async (
  organizationId: number | null
): Promise<DashboardCard[]> => {
  const response = await axiosInstance.get<DashboardCard[]>(
    apiUrls.dashboardCards.base(organizationId)
  );
  return response.data;
};

export const updateCard = async (
  cardId: number,
  updates: Partial<DashboardCard>
): Promise<DashboardCard> => {
  const response = await axiosInstance.put<DashboardCard>(
    apiUrls.dashboardCards.byId(cardId),
    updates
  );
  return response.data;
};

export const addCard = async (
  organizationId: number | null,
  card: Omit<DashboardCard, "id">
): Promise<DashboardCard> => {
  const response = await axiosInstance.post<DashboardCard>(
    apiUrls.dashboardCards.base(organizationId),
    card
  );
  return response.data;
};

export const removeCard = async (cardId: number): Promise<void> => {
  await axiosInstance.delete(apiUrls.dashboardCards.byId(cardId));
};

export const updateLayouts = async (
  cardId: number,
  layouts: GridLayouts
): Promise<DashboardCard[]> => {
  const response = await axiosInstance.put<DashboardCard>(
    apiUrls.dashboardCards.byId(cardId),
    {
      layout: {
        lg: layouts.lg.find(l => l.i === String(cardId)),
        md: layouts.md?.find(l => l.i === String(cardId)),
        sm: layouts.sm?.find(l => l.i === String(cardId)),
        xs: layouts.xs?.find(l => l.i === String(cardId)),
      },
    }
  );
  return [response.data];
};

export const reorderCards = async (
  organizationId: number | null,
  cardIds: number[]
): Promise<DashboardCard[]> => {
  const response = await axiosInstance.put<DashboardCard[]>(
    apiUrls.dashboardCards.base(organizationId),
    { cardIds }
  );
  return response.data;
};
