import type { Customer } from '../../domain/models/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetCustomersUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(limit: number, offset: number): Promise<Customer[]> {
    return this.repository.getAll(limit, offset);
  }
}
