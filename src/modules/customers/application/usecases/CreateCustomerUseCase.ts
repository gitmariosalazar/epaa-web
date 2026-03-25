import type {
  CreateCustomerRequest,
  CustomerRepository
} from '../../domain/repositories/CustomerRepository';

export class CreateCustomerUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(customer: CreateCustomerRequest): Promise<void> {
    return this.repository.create(customer);
  }
}
