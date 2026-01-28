import type { Role } from '../models/Role';

export interface RoleRepository {
  findAll(limit: number, offset: number): Promise<Role[]>;
  findById(rolId: number): Promise<Role>;
  createRole(role: Omit<Role, 'id' | 'active'>): Promise<Role>;
  updateRole(rolId: number, role: Partial<Role>): Promise<Role>;
}
