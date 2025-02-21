import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { Notification } from "@interfaces/notification.interface";

export const getNotifications = async (organizationId: number) => {
  const { data } = await axiosInstance.get<Notification[]>(
    apiUrls.notifications.byOrganization(organizationId)
  );
  return data;
};

export const getNotificationById = async (id: number) => {
  const { data } = await axiosInstance.get<Notification>(
    apiUrls.notifications.byId(id)
  );
  return data;
};

export const markNotificationAsRead = async (id: number) => {
  const { data } = await axiosInstance.put<Notification>(
    apiUrls.notifications.read(id)
  );
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await axiosInstance.put(apiUrls.notifications.readAll());
  return data;
};
