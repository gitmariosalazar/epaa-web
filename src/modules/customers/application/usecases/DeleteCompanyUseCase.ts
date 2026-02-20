import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class DeleteCompanyUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
