import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode
} from 'react';
import type { SeasonalConfig } from '../../domain/models/SeasonalTheme';
import type { SeasonalRepository } from '../../domain/repositories/SeasonalRepository';
import { LocalStorageSeasonalRepository } from '../../infrastructure/repositories/LocalStorageSeasonalRepository';
import { GetSeasonalConfigUseCase } from '../../application/usecases/GetSeasonalConfigUseCase';
import { SaveSeasonalConfigUseCase } from '../../application/usecases/SaveSeasonalConfigUseCase';
import { ToggleSnowUseCase } from '../../application/usecases/ToggleSnowUseCase';
import { ToggleBannerUseCase } from '../../application/usecases/ToggleBannerUseCase';
import { ToggleGlobalSeasonalUseCase } from '../../application/usecases/ToggleGlobalSeasonalUseCase';
import { ResetSeasonalConfigUseCase } from '../../application/usecases/ResetSeasonalConfigUseCase';

export interface SeasonalContextValue {
  config: SeasonalConfig;
  toggleSnow: (enabled?: boolean) => void;
  toggleBanner: (enabled?: boolean) => void;
  toggleGlobal: (enabled?: boolean) => void;
  dismissBanner: () => void;
  resetConfig: () => void;
  updateConfig: (patch: Partial<SeasonalConfig>) => void;
}

const SeasonalContext = createContext<SeasonalContextValue | null>(null);

export interface SeasonalProviderProps {
  children: ReactNode;
  repository?: SeasonalRepository;
}

export const SeasonalProvider: React.FC<SeasonalProviderProps> = ({
  children,
  repository
}) => {
  const repo = useMemo(
    () => repository || new LocalStorageSeasonalRepository(),
    [repository]
  );

  const useCases = useMemo(
    () => ({
      getConfig: new GetSeasonalConfigUseCase(repo),
      saveConfig: new SaveSeasonalConfigUseCase(repo),
      toggleSnow: new ToggleSnowUseCase(repo),
      toggleBanner: new ToggleBannerUseCase(repo),
      toggleGlobal: new ToggleGlobalSeasonalUseCase(repo),
      resetConfig: new ResetSeasonalConfigUseCase(repo)
    }),
    [repo]
  );

  const [config, setConfig] = useState<SeasonalConfig>(() =>
    useCases.getConfig.execute()
  );

  const toggleSnow = useCallback(
    (enabled?: boolean) => {
      const boolValue = typeof enabled === 'boolean' ? enabled : undefined;
      const updated = useCases.toggleSnow.execute(boolValue);
      setConfig(updated);
    },
    [useCases]
  );

  const toggleBanner = useCallback(
    (enabled?: boolean) => {
      const boolValue = typeof enabled === 'boolean' ? enabled : undefined;
      const updated = useCases.toggleBanner.execute(boolValue);
      setConfig(updated);
    },
    [useCases]
  );

  const toggleGlobal = useCallback(
    (enabled?: boolean) => {
      const boolValue = typeof enabled === 'boolean' ? enabled : undefined;
      const updated = useCases.toggleGlobal.execute(boolValue);
      setConfig(updated);
    },
    [useCases]
  );

  const dismissBanner = useCallback(() => {
    const updated = useCases.toggleBanner.execute(false);
    setConfig(updated);
  }, [useCases]);

  const resetConfig = useCallback(() => {
    const reset = useCases.resetConfig.execute();
    setConfig(reset);
  }, [useCases]);

  const updateConfig = useCallback(
    (patch: Partial<SeasonalConfig>) => {
      setConfig((prev) => {
        const updated: SeasonalConfig = { ...prev, ...patch };
        useCases.saveConfig.execute(updated);
        return updated;
      });
    },
    [useCases]
  );

  const value = useMemo<SeasonalContextValue>(
    () => ({
      config,
      toggleSnow,
      toggleBanner,
      toggleGlobal,
      dismissBanner,
      resetConfig,
      updateConfig
    }),
    [config, toggleSnow, toggleBanner, toggleGlobal, dismissBanner, resetConfig, updateConfig]
  );

  return (
    <SeasonalContext.Provider value={value}>
      {children}
    </SeasonalContext.Provider>
  );
};

export const useSeasonal = (): SeasonalContextValue => {
  const context = useContext(SeasonalContext);
  if (!context) {
    throw new Error('useSeasonal debe ser usado dentro de un <SeasonalProvider>');
  }
  return context;
};
