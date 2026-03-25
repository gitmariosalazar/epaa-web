import type { Company } from '../../domain/models/Company';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class GetCompanyByRucUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(ruc: string): Promise<Company> {
    return this.repository.getByRuc(ruc);
  }
}
