import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';
import {
  type SeasonalConfig,
  GLOBAL_SEASONAL_MASTER_SWITCH,
  isHolidaySeasonDate
} from '../../domain/models/SeasonalTheme';

export class LocalStorageSeasonalRepository implements SeasonalRepository {
  private readonly storageKey: string = 'epaa_seasonal_config_v2';

  getConfig(): SeasonalConfig {
    if (!GLOBAL_SEASONAL_MASTER_SWITCH) {
      return this.getDisabledConfig();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SeasonalConfig>;
        return {
          ...this.getDefaultConfig(),
          ...parsed
        };
      }
    } catch {
      // Ignorar error de JSON corrupto y usar default
    }

    return this.getDefaultConfig();
  }

  saveConfig(config: SeasonalConfig): void {
    try {
      const cleanConfig: SeasonalConfig = {
        enabled: Boolean(config.enabled),
        holiday: config.holiday || 'christmas',
        showSnow: Boolean(config.showSnow),
        showBanner: Boolean(config.showBanner),
        showDecorations: Boolean(config.showDecorations),
        bannerMessage: String(config.bannerMessage || ''),
        bannerSubMessage: config.bannerSubMessage ? String(config.bannerSubMessage) : undefined,
        autoSchedule: Boolean(config.autoSchedule)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(cleanConfig));
    } catch (e) {
      console.warn('[Seasonal] No se pudo guardar la configuración festiva:', e);
    }
  }

  toggleSnow(enabled?: boolean): SeasonalConfig {
    const current = this.getConfig();
    const nextSnow = typeof enabled === 'boolean' ? enabled : !current.showSnow;
    const updated: SeasonalConfig = {
      ...current,
      showSnow: nextSnow
    };
    this.saveConfig(updated);
    return updated;
  }

  toggleBanner(enabled?: boolean): SeasonalConfig {
    const current = this.getConfig();
    const nextBanner = typeof enabled === 'boolean' ? enabled : !current.showBanner;
    const updated: SeasonalConfig = {
      ...current,
      showBanner: nextBanner
    };
    this.saveConfig(updated);
    return updated;
  }

  toggleGlobal(enabled?: boolean): SeasonalConfig {
    const current = this.getConfig();
    const nextEnabled = typeof enabled === 'boolean' ? enabled : !current.enabled;
    const updated: SeasonalConfig = {
      ...current,
      enabled: nextEnabled,
      showSnow: nextEnabled ? current.showSnow : false
    };
    this.saveConfig(updated);
    return updated;
  }

  resetConfig(): SeasonalConfig {
    const defaultConfig = this.getDefaultConfig();
    this.saveConfig(defaultConfig);
    return defaultConfig;
  }

  private getDefaultConfig(): SeasonalConfig {
    // Si la fecha cae en temporada navideña (o para demos/días festivos)
    const inSeason = isHolidaySeasonDate() || true;

    return {
      enabled: inSeason && GLOBAL_SEASONAL_MASTER_SWITCH,
      holiday: 'christmas',
      showSnow: true,
      showBanner: true,
      showDecorations: true,
      bannerMessage: '¡Feliz Navidad y un Próspero Año Nuevo les desea EPAA!',
      bannerSubMessage: 'Paz, salud y bienestar para ti y tu familia',
      autoSchedule: true
    };
  }

  private getDisabledConfig(): SeasonalConfig {
    return {
      enabled: false,
      holiday: 'none',
      showSnow: false,
      showBanner: false,
      showDecorations: false,
      bannerMessage: '',
      autoSchedule: false
    };
  }
}
