// Professional Google Maps Theme Styles — Incidents Map

export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca3af' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b7280' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1e2d2b' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2d3548' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1a2030' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b9db5' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3f4b65' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#252e40' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3b5272' }]
  }
];

export const SILVER_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f0f4f8' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca3af' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#e5e7eb' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#d1d5db' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#bfdbfe' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93c5fd' }]
  }
];
