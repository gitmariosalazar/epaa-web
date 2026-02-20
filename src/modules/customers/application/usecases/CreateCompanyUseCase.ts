import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class CreateCompanyUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(company: CreateCompanyRequest): Promise<void> {
    return this.repository.create(company);
  }
}
