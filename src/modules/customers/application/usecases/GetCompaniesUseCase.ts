import type { Company } from '../../domain/models/Company';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class GetCompaniesUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(limit: number, offset: number): Promise<Company[]> {
    return this.repository.getAll(limit, offset);
  }
}
