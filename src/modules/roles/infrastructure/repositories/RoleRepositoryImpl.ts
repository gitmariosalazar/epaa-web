import type { Role } from '@/modules/roles/domain/models/Role';
import type { RoleRepository } from '@/modules/roles/domain/repositories/RoleRepository';
import { api } from '@/shared/infrastructure/http/api';

export class RoleRepositoryImpl implements RoleRepository {
  async findAll(limit: number, offset: number): Promise<Role[]> {
    const response = await api.get('/roles/get-all-rols', {
      params: { limit, offset }
    });
    return response.data.data;
  }

  async findById(rolId: number): Promise<Role> {
    const response = await api.get(`/roles/get-rol-by-id/${rolId}`);
    return response.data.data;
  }

  async createRole(role: Omit<Role, 'id' | 'active'>): Promise<Role> {
    const response = await api.post('/roles/create-rol', role);
    return response.data.data;
  }

  async updateRole(rolId: number, role: Partial<Role>): Promise<Role> {
    const response = await api.put(`/roles/update-rol/${rolId}`, role);
    return response.data.data;
  }
}
