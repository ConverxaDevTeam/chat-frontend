export enum NotificationType {
  SYSTEM = "SYSTEM",
  USER = "USER",
}

export interface Notification {
  id: number;
  title: string;
  created_at: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  updatedAt: string;
  type: NotificationType;
}
