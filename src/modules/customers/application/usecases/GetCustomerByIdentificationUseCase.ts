import type { Customer } from '../../domain/models/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetCustomerByIdentificationUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(identification: string): Promise<Customer | null> {
    return this.repository.findByIdentification(identification);
  }
}
