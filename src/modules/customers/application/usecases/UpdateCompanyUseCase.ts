import type {
  CompanyRepository,
  UpdateCompanyRequest
} from '../../domain/repositories/CompanyRepository';

export class UpdateCompanyUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(id: string, company: UpdateCompanyRequest): Promise<void> {
    return this.repository.update(id, company);
  }
}
