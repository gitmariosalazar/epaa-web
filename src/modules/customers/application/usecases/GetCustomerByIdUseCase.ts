import type { Customer } from '../../domain/models/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetCustomerByIdUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Customer> {
    return this.repository.getById(id);
  }
}
