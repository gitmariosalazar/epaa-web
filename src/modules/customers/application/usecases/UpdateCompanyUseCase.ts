import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class UpdateCompanyUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(id: string, company: CreateCompanyRequest): Promise<void> {
    return this.repository.update(id, company);
  }
}
