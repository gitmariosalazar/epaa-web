import type { Company } from '../../domain/models/Company';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class GetCompanyByIdUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Company> {
    return this.repository.getById(id);
  }
}
