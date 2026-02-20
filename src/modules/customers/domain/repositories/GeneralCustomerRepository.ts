import type { GeneralCustomer } from '../models/GeneralCustomer';

export interface GeneralCustomerRepository {
  getAll(limit: number, offset: number): Promise<GeneralCustomer[]>;
}
