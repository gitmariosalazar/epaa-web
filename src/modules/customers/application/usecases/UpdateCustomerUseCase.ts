import type {
  CustomerRepository,
  UpdateCustomerRequest
} from '../../domain/repositories/CustomerRepository';

export class UpdateCustomerUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(id: string, customer: UpdateCustomerRequest): Promise<void> {
    return this.repository.update(id, customer);
  }
}
