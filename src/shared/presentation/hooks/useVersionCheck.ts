import { useEffect, useState } from 'react';

export const useVersionCheck = (intervalMs = 5 * 60 * 1000) => {
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [initialVersion, setInitialVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // Añadimos un timestamp para evitar la caché del navegador
        const response = await fetch(`/version.json?t=${new Date().getTime()}`, {
          cache: 'no-store'
        });
        if (!response.ok) return;
        
        const data = await response.json();
        const serverVersion = data.version;

        if (serverVersion) {
          if (!initialVersion) {
            setInitialVersion(serverVersion);
          } else if (initialVersion !== serverVersion) {
            setHasNewVersion(true);
          }
        }
      } catch (error) {
        // Fallo silencioso si no hay red
      }
    };

    // Hacer la primera carga después de que el componente monte
    const timeoutId = setTimeout(fetchVersion, 5000);
    const intervalId = setInterval(fetchVersion, intervalMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [initialVersion, intervalMs]);

  return { hasNewVersion };
};
