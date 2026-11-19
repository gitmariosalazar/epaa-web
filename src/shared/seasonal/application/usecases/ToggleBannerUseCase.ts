import type { SeasonalConfig } from '../../domain/models/SeasonalTheme';
import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';

export class ToggleBannerUseCase {
  private readonly repository: SeasonalRepository;

  constructor(repository: SeasonalRepository) {
    this.repository = repository;
  }

  execute(enabled?: boolean): SeasonalConfig {
    const sanitized = typeof enabled === 'boolean' ? enabled : undefined;
    return this.repository.toggleBanner(sanitized);
  }
}
