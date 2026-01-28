import type { Permission } from '@/modules/permissions/domain/models/Permission';

export interface Role {
  rolId: number;
  name: string;
  description: string;
  isActive: boolean;
  parentRolId?: number | null;
  permissions?: Permission[];
}
