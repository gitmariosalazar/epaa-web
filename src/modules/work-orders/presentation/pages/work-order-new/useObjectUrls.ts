import { useEffect, useMemo } from 'react';

/** Genera URLs de previsualización para los File y las libera al cambiar/desmontar. */
export const useObjectUrls = (files: File[]): string[] => {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  return urls;
};
