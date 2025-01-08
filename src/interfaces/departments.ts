export interface IDepartment {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization_id: number;
}

export interface IDepartmentCreate {
  name: string;
  organization_id: number;
}

export interface IDepartmentUpdate {
  name: string;
}
