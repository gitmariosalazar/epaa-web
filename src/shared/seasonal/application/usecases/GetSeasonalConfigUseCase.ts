import type { SeasonalConfig } from '../../domain/models/SeasonalTheme';
import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';

export class GetSeasonalConfigUseCase {
  private readonly repository: SeasonalRepository;

  constructor(repository: SeasonalRepository) {
    this.repository = repository;
  }

  execute(): SeasonalConfig {
    return this.repository.getConfig();
  }
}
