export interface Permission {
  permissionId: number;
  permissionName: string;
  permissionDescription: string;
  scopes?: string;
  isActive: boolean;
  categoryId: string;
}
