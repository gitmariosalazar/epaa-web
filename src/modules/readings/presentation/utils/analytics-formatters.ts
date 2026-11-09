export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || Number.isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatVolume = (val: number | undefined | null): string => {
  if (val === undefined || val === null || Number.isNaN(val)) return '0 m³';
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(val)} m³`;
};

export const formatNumber = (val: number | undefined | null): string => {
  if (val === undefined || val === null || Number.isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatPercent = (val: number | undefined | null): string => {
  if (val === undefined || val === null || Number.isNaN(val)) return '0.00%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}%`;
};

export const getDiagnosticStatus = (
  diagnostic: string | undefined | null,
): 'success' | 'warning' | 'error' | 'info' | 'primary' => {
  if (!diagnostic) return 'info';
  const text = diagnostic.toUpperCase();
  if (text.includes('ALTA RECUPERACIÓN') || text.includes('RECUPERACION') || text.includes('CRECIMIENTO')) {
    if (text.includes('ALTA')) return 'success';
    return 'primary';
  }
  if (text.includes('SUBFACTURACIÓN') || text.includes('ALERTA') || text.includes('CAÍDA') || text.includes('NEGATIVO')) {
    return 'error';
  }
  if (text.includes('MODERADO') || text.includes('ESTABLE')) {
    return 'info';
  }
  return 'warning';
};
