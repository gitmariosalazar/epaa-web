import type { UserRepository } from '../../domain/repositories/UserRepository';

export class FindTechniciansUseCase {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(type: string): Promise<any[]> {
    return await this.repository.findTechnicians(type);
  }
}
