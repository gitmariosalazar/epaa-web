import type { Customer } from '../../domain/models/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class UpdateCustomerUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(id: string, customer: Partial<Customer>): Promise<void> {
    return this.repository.update(id, customer);
  }
}
