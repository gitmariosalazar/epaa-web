import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';
import {
  type SeasonalConfig,
  type SeasonalUserPreferences,
  GLOBAL_SEASONAL_MASTER_SWITCH,
  isHolidaySeasonDate
} from '../../domain/models/SeasonalTheme';

/**
 * LocalStorageSeasonalRepository
 * Infrastructure layer - Implements SeasonalRepository using browser localStorage.
 *
 * Clean Architecture & SOLID:
 * - SRP: Only responsible for storing/retrieving user preferences.
 *   Does NOT persist presentation copy (Single Source of Truth stays in UI/components).
 * - LSP: Conforms fully to SeasonalRepository contract.
 * - DIP: Consumers depend on SeasonalRepository, not this implementation directly.
 */
export class LocalStorageSeasonalRepository implements SeasonalRepository {
  private readonly storageKey: string = 'epaa_seasonal_config_v2';

  getConfig(): SeasonalConfig {
    if (!GLOBAL_SEASONAL_MASTER_SWITCH) {
      return this.getDisabledConfig();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SeasonalConfig & SeasonalUserPreferences>;

        // Migration/Sanitization: Eliminar cualquier copia de texto persistida antigua
        // para garantizar que los cambios en ChristmasBanner.tsx tomen efecto inmediatamente (HMR).
        if ('bannerMessage' in parsed || 'bannerSubMessage' in parsed) {
          delete parsed.bannerMessage;
          delete parsed.bannerSubMessage;
          // Si el banner estaba cerrado en la versión anterior con datos obsoletos, restaurarlo
          parsed.showBanner = true;
          this.savePreferencesOnly(parsed);
        }

        return this.getDefaultConfig(parsed);
      }
    } catch {
      // Ignorar error de JSON corrupto y usar default
    }

    return this.getDefaultConfig();
  }

  saveConfig(config: SeasonalConfig): void {
    this.savePreferencesOnly(config);
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
    const nextBanner =
      typeof enabled === 'boolean' ? enabled : !current.showBanner;
    const updated: SeasonalConfig = {
      ...current,
      showBanner: nextBanner
    };
    this.saveConfig(updated);
    return updated;
  }

  toggleGlobal(enabled?: boolean): SeasonalConfig {
    const current = this.getConfig();
    const nextEnabled =
      typeof enabled === 'boolean' ? enabled : !current.enabled;
    const updated: SeasonalConfig = {
      ...current,
      enabled: nextEnabled,
      showSnow: nextEnabled ? current.showSnow : false
    };
    this.saveConfig(updated);
    return updated;
  }

  resetConfig(): SeasonalConfig {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Ignorar error al limpiar storage
    }
    return this.getDefaultConfig();
  }

  /**
   * Persiste ÚNICAMENTE las preferencias del usuario (booleanos de control).
   * No persiste texto ni contenido visual estático.
   */
  private savePreferencesOnly(prefs: Partial<SeasonalUserPreferences>): void {
    try {
      const cleanPrefs: SeasonalUserPreferences = {
        enabled: prefs.enabled !== undefined ? Boolean(prefs.enabled) : true,
        showSnow: prefs.showSnow !== undefined ? Boolean(prefs.showSnow) : true,
        showBanner: prefs.showBanner !== undefined ? Boolean(prefs.showBanner) : true
      };
      localStorage.setItem(this.storageKey, JSON.stringify(cleanPrefs));
    } catch (e) {
      console.warn(
        '[Seasonal] No se pudo guardar la configuración festiva:',
        e
      );
    }
  }

  private getDefaultConfig(prefs?: Partial<SeasonalUserPreferences>): SeasonalConfig {
    const inSeason = isHolidaySeasonDate() || true;

    return {
      enabled: prefs?.enabled ?? (inSeason && GLOBAL_SEASONAL_MASTER_SWITCH),
      holiday: 'christmas',
      showSnow: prefs?.showSnow ?? true,
      showBanner: prefs?.showBanner ?? true,
      showDecorations: true,
      autoSchedule: true
      // bannerMessage y bannerSubMessage se dejan sin definir a propósito
      // para que el componente ChristmasBanner.tsx sea la Única Fuente de Verdad.
    };
  }

  private getDisabledConfig(): SeasonalConfig {
    return {
      enabled: false,
      holiday: 'none',
      showSnow: false,
      showBanner: false,
      showDecorations: false,
      autoSchedule: false
    };
  }
}
