import type { SeasonalConfig } from '../../domain/models/SeasonalTheme';
import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';

export class SaveSeasonalConfigUseCase {
  private readonly repository: SeasonalRepository;

  constructor(repository: SeasonalRepository) {
    this.repository = repository;
  }

  execute(config: SeasonalConfig): void {
    this.repository.saveConfig(config);
  }
}
