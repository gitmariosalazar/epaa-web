export interface IGeoLocationData {
  /** Coordenadas físicas y métricas del hardware GPS */
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number; // Precisión en metros (ej: 4.5)
    altitude: number | null; // Altura sobre el nivel del mar
    altitudeAccuracy: number | null;
    speed: number | null; // Velocidad en m/s
    heading: number | null; // Dirección en grados (0-360)
  };

  /** Timestamp Unix exacto de cuándo se capturó la coordenada */
  timestamp: number;

  /** * Dirección postal legible (Geocodificación Inversa)
   * Se llena tras procesar la latitud y longitud con una API (Google Maps, OpenStreetMap, etc.)
   */
  address?: {
    country: string; // País (ej: "Ecuador")
    countryCode: string; // Código de país (ej: "EC")
    state: string; // Provincia / Estado / Departamento (ej: "Imbabura")
    city: string; // Ciudad / Cantón (ej: "Ibarra")
    neighborhood: string; // Barrio / Sector (ej: "Centro Histórico")
    street: string; // Calle principal (ej: "Av. Amazonas")
    streetNumber: string; // Número de casa o intersección (ej: "N32-45" o "e Inca")
    postalCode: string | null; // Código postal
    formattedAddress: string; // Dirección completa en un solo string
  };

  /** Datos de control y auditoría en campo (Muy recomendados para tu App) */
  metadata?: {
    batteryLevel: number; // Nivel de batería del celular (0.0 a 1.0)
    isFromMockProvider: boolean; // TRUE si el lector está usando una App para falsear el GPS (Fake GPS)
    isWifiEnabled: boolean; // Si el Wi-Fi estaba activo (ayuda a la precisión en interiores)
    deviceName: string; // Modelo del celular (ej: "Xiaomi Redmi Note 13")
  };
}
