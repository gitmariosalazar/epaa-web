import type { Customer } from '../../domain/models/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class CreateCustomerUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(
    customer: Omit<Customer, 'customerId'> & { customerId: string }
  ): Promise<void> {
    return this.repository.create(customer);
  }
}
