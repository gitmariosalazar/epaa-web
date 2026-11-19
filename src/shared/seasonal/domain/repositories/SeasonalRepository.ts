import type { SeasonalConfig } from '../models/SeasonalTheme';

export interface SeasonalRepository {
  getConfig(): SeasonalConfig;
  saveConfig(config: SeasonalConfig): void;
  toggleSnow(enabled?: boolean): SeasonalConfig;
  toggleBanner(enabled?: boolean): SeasonalConfig;
  toggleGlobal(enabled?: boolean): SeasonalConfig;
  resetConfig(): SeasonalConfig;
}
