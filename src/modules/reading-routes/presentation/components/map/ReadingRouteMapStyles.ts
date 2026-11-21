// Estilos Google Maps para Modo Oscuro y Claro — Rutas de Lectura
export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca3af' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b7280' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1e2d2b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2d3548' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1a2030' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b9db5' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3f4b65' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#252e40' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3b5272' }],
  },
];

export const SILVER_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9e2f4' }],
  },
];

export type MapColorScheme = 'DARK' | 'LIGHT';

export interface MapPolygonTheme {
  selectedStroke: string;
  selectedStrokeWeight: number;
  unselectedStrokeWeight: number;
  selectedFillOpacity: number;
  unselectedFillOpacity: number;
}

export interface MapThemeConfig {
  isDark: boolean;
  colorScheme: MapColorScheme;
  styles: google.maps.MapTypeStyle[];
  polygon: MapPolygonTheme;
}

export const OPERATOR_PALETTE = [
  '#0284c7', // Azul Cielo
  '#10b981', // Verde Esmeralda
  '#f59e0b', // Ámbar / Dorado
  '#8b5cf6', // Violeta / Púrpura
  '#ec4899', // Rosa
  '#06b6d4', // Cian
  '#f97316', // Naranja
  '#14b8a6', // Turquesa
  '#6366f1', // Índigo
  '#84cc16', // Lima
  '#d946ef', // Fucsia
  '#e11d48', // Carmesí
];

export const getOperatorColor = (operatorId: string, index?: number): string => {
  if (typeof index === 'number' && index >= 0) {
    return OPERATOR_PALETTE[index % OPERATOR_PALETTE.length];
  }
  let hash = 0;
  for (let i = 0; i < operatorId.length; i++) {
    hash = operatorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % OPERATOR_PALETTE.length;
  return OPERATOR_PALETTE[idx];
};

/**
 * Resolves map theme configuration adhering to Open/Closed Principle (OCP)
 * and Single Responsibility Principle (SRP). Provides unified dark/light
 * adaptation for base vector/raster styles and GeoJSON feature aesthetics.
 */
export const getMapThemeConfig = (theme: string): MapThemeConfig => {
  const isDark = theme === 'dark';
  return {
    isDark,
    colorScheme: isDark ? 'DARK' : 'LIGHT',
    styles: isDark ? DARK_MAP_STYLE : SILVER_MAP_STYLE,
    polygon: {
      selectedStroke: isDark ? '#ffffff' : '#0f172a',
      selectedStrokeWeight: 3.5,
      unselectedStrokeWeight: 1.5,
      selectedFillOpacity: isDark ? 0.5 : 0.45,
      unselectedFillOpacity: isDark ? 0.28 : 0.2,
    },
  };
};
