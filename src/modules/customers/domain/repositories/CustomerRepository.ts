import type { Customer } from '../models/Customer';

export interface CustomerRepository {
  getAll(limit: number, offset: number): Promise<Customer[]>;
  getById(id: string): Promise<Customer>;
  create(
    customer: Omit<Customer, 'customerId'> & { customerId: string }
  ): Promise<void>;
  update(id: string, customer: Partial<Customer>): Promise<void>;
  delete(id: string): Promise<void>;
  findByIdentification(identification: string): Promise<Customer | null>;
}
