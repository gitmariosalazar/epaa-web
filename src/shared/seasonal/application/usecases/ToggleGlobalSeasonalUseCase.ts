import type { SeasonalConfig } from '../../domain/models/SeasonalTheme';
import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';

export class ToggleGlobalSeasonalUseCase {
  private readonly repository: SeasonalRepository;

  constructor(repository: SeasonalRepository) {
    this.repository = repository;
  }

  execute(enabled?: boolean): SeasonalConfig {
    const boolValue = typeof enabled === 'boolean' ? enabled : undefined;
    return this.repository.toggleGlobal(boolValue);
  }
}
