import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import type { GeneralCustomerRepository } from '../../domain/repositories/GeneralCustomerRepository';

export class GetGeneralCustomersUseCase {
  private readonly repository: GeneralCustomerRepository;

  constructor(repository: GeneralCustomerRepository) {
    this.repository = repository;
  }

  async execute(limit: number, offset: number): Promise<GeneralCustomer[]> {
    return this.repository.getAll(limit, offset);
  }
}
