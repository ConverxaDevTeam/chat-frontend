// Interfaces for HITL System

export interface HitlType {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator: UserBasic;
  userHitlTypes: HitlUserAssignment[];
}

export interface HitlUserAssignment {
  id: number;
  user_id: number;
  hitl_type_id: number;
  organization_id: number;
  created_at: string;
  user: UserBasic;
}

export interface UserBasic {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface HitlNotification {
  type: string;
  message: string;
  conversationId: number;
  hitlType: string;
  timestamp: string;
  read?: boolean;
}

export interface CreateHitlTypeRequest {
  name: string;
  description: string;
}

export interface UpdateHitlTypeRequest {
  name?: string;
  description?: string;
}

export interface AssignUsersToHitlTypeRequest {
  userIds: number[];
}

export interface HitlPermissions {
  canManageHitlTypes: boolean;
  canReceiveHitlNotifications: boolean;
}

export interface UserRoleResponse {
  role: "owner" | "hitl" | "admin" | "user";
  permissions: HitlPermissions;
}

export interface HitlUserWithRole extends UserBasic {
  role: string;
}

export enum HitlPermission {
  MANAGE_TYPES = "MANAGE_TYPES",
  RECEIVE_NOTIFICATIONS = "RECEIVE_NOTIFICATIONS",
}

export enum HitlStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface HitlTypeFormData {
  name: string;
  description: string;
}

export interface HitlTypeWithStatus extends HitlType {
  status: HitlStatus;
  assignedUsersCount: number;
}
