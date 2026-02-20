import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class DeleteCustomerUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
