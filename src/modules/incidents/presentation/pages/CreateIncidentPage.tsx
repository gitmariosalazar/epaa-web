import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin, UploadCloud, ArrowLeft, X, Droplets, Wrench, ShieldAlert, HelpCircle, ChevronDown, AlertTriangle, Gauge, Network, Waves } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useIncidentContext } from '../context/IncidentContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import type { IGeoLocationData } from '@/shared/utils/types/IGeolocationData';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import '../styles/CreateIncidentPage.css';
import { SearchToolbar } from '../components/SearchToolbar';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useReading } from '@/modules/readings/presentation/hooks/useReading';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { IconSize } from '@/shared/utils/sizes/size-icon';

// Helper to dynamically load Leaflet from CDN
const loadLeaflet = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const L = (window as any).L;
    if (L) {
      resolve(L);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        const loadedL = (window as any).L;
        if (loadedL) {
          resolve(loadedL);
        } else {
          reject(new Error('Leaflet global object not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Leaflet script'));
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        const loadedL = (window as any).L;
        if (loadedL) {
          clearInterval(interval);
          resolve(loadedL);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Timeout waiting for Leaflet to load'));
      }, 10000);
    }
  });
};

// Helper to get category-specific colors and icons
const getCategoryDetails = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  const iconSizeSmall = IconSize.xs;
  const iconSizeLarge = IconSize.md;
  if (name.includes('fuga')) {
    return {
      icon: <Droplets size={iconSizeSmall} />,
      iconLg: <Droplets size={iconSizeLarge} />,
      color: 'var(--accent, #3b82f6)',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.15)'
    };
  }
  if (name.includes('infraestructura')) {
    return {
      icon: <Wrench size={iconSizeSmall} />,
      iconLg: <Wrench size={iconSizeLarge} />,
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.08)',
      borderColor: 'rgba(249, 115, 22, 0.15)'
    };
  }
  if (
    name.includes('daño') ||
    name.includes('dano') ||
    name.includes('perdida') ||
    name.includes('pérdida') ||
    name.includes('robo')
  ) {
    return {
      icon: <ShieldAlert size={iconSizeSmall} />,
      iconLg: <ShieldAlert size={iconSizeLarge} />,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.15)'
    };
  }
  if (name.includes('fraude') || name.includes('irregular')) {
    return {
      icon: <AlertTriangle size={iconSizeSmall} />,
      iconLg: <AlertTriangle size={iconSizeLarge} />,
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.08)',
      borderColor: 'rgba(234, 179, 8, 0.15)'
    };
  }
  if (name.includes('consumo') || name.includes('anomalia') || name.includes('anomalía')) {
    return {
      icon: <Gauge size={iconSizeSmall} />,
      iconLg: <Gauge size={iconSizeLarge} />,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.08)',
      borderColor: 'rgba(6, 182, 212, 0.15)'
    };
  }
  if (
    name.includes('red_matriz') ||
    name.includes('red matriz') ||
    name.includes('via') ||
    name.includes('vía') ||
    name.includes('pública') ||
    name.includes('publica')
  ) {
    return {
      icon: <Network size={iconSizeSmall} />,
      iconLg: <Network size={iconSizeLarge} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.15)'
    };
  }
  if (name.includes('alcantarillado')) {
    return {
      icon: <Waves size={iconSizeSmall} />,
      iconLg: <Waves size={iconSizeLarge} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.15)'
    };
  }
  return {
    icon: <HelpCircle size={iconSizeSmall} />,
    iconLg: <HelpCircle size={iconSizeLarge} />,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.15)'
  };
};

// Helper to compress images client-side before base64 conversion
const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas 2d context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const CreateIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, createIncident, isLoading } = useIncidentContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [connectionId, setConnectionId] = useState('');
  const [readingId, setReadingId] = useState('');
  const [incidentTypeId, setIncidentTypeId] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [referenceAddress, setReferenceAddress] = useState('');
  const [reportOrigin, setReportOrigin] = useState<'LECTURISTA' | 'ATENCION_AL_CLIENTE' | 'INSPECTOR' | 'WEB_USUARIO'>('ATENCION_AL_CLIENTE');
  const [priority, setPriority] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [gpsData, setGpsData] = useState<IGeoLocationData | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const {
    readingInfo,
    isLoadingInfo,
    fetchReadingData,
    clearData
  } = useReading();

  const activeReadingInfo = readingInfo && readingInfo.length > 0 ? readingInfo[0] : null;

  useEffect(() => {
    if (activeReadingInfo) {
      if (activeReadingInfo.readingId) {
        setReadingId(String(activeReadingInfo.readingId));
      }
      if (activeReadingInfo.cadastralKey) {
        setConnectionId(activeReadingInfo.cadastralKey);
      }
    } else {
      setReadingId('');
    }
  }, [activeReadingInfo]);


  const handleSearch = () => {
    if (!connectionId.trim()) {
      MessageToastCustom(
        'error',
        'Ingrese una clave catastral para buscar.',
        'Error',
        { position: 'top-right' }
      );
      return;
    }
    fetchReadingData(connectionId.trim());
  };

  const handleCancel = () => {
    setConnectionId('');
    clearData();
  };

  // Find the selected incident type object
  const selectedIncidentTypeObj = categories
    .flatMap((category) =>
      category.incidentTypes.map((type: any) => ({
        categoryName: category.categoryName,
        typeCode: type.typeCode,
        typeName: type.typeName
      }))
    )
    .find((t) => String(t.typeCode) === incidentTypeId);

  // Geolocation and uploader state & refs
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const triggerReverseGeocode = (lat: number, lng: number) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.address) {
          const addr = data.address;
          setGpsData((prev) => {
            const currentAccuracy = prev?.coords?.accuracy ?? 10;
            const currentAltitude = prev?.coords?.altitude ?? null;
            return {
              coords: {
                latitude: lat,
                longitude: lng,
                accuracy: currentAccuracy,
                altitude: currentAltitude,
                altitudeAccuracy: prev?.coords?.altitudeAccuracy ?? null,
                speed: prev?.coords?.speed ?? null,
                heading: prev?.coords?.heading ?? null
              },
              timestamp: Date.now(),
              address: {
                country: addr.country || 'Ecuador',
                countryCode: (addr.country_code || 'EC').toUpperCase(),
                state: addr.state || addr.region || '',
                city: addr.city || addr.town || addr.village || addr.municipality || '',
                neighborhood: addr.neighbourhood || addr.suburb || addr.quarter || '',
                street: addr.road || '',
                streetNumber: addr.house_number || '',
                postalCode: addr.postcode || null,
                formattedAddress: data.display_name || ''
              }
            };
          });


        }
      })
      .catch((err) => console.error('Error in drag reverse geocoding:', err));
  };

  useEffect(() => {
    if (!showMap || !latitude || !longitude) return;

    let mapInstance: any = null;
    loadLeaflet()
      .then((L) => {
        const center: [number, number] = [Number(latitude), Number(longitude)];
        mapInstance = L.map('incident-map').setView(center, 16);
        mapRef.current = mapInstance;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const DefaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const marker = L.marker(center, { draggable: true }).addTo(mapInstance);
        markerRef.current = marker;

        marker.on('dragend', () => {
          const position = marker.getLatLng();
          setLatitude(String(position.lat.toFixed(6)));
          setLongitude(String(position.lng.toFixed(6)));
          triggerReverseGeocode(position.lat, position.lng);
        });

        mapInstance.on('click', (e: any) => {
          const position = e.latlng;
          marker.setLatLng(position);
          setLatitude(String(position.lat.toFixed(6)));
          setLongitude(String(position.lng.toFixed(6)));
          triggerReverseGeocode(position.lat, position.lng);
        });
      })
      .catch((err) => {
        console.error('Error loading Leaflet map:', err);
      });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [showMap]);

  useEffect(() => {
    if (mapRef.current && markerRef.current && latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const newLatLng = { lat, lng };

      const currentLatLng = markerRef.current.getLatLng();
      if (currentLatLng.lat.toFixed(6) !== lat.toFixed(6) || currentLatLng.lng.toFixed(6) !== lng.toFixed(6)) {
        markerRef.current.setLatLng(newLatLng);
        mapRef.current.panTo(newLatLng);
      }
    }
  }, [latitude, longitude]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setFormError('La geolocalización no es soportada por este navegador.');
      return;
    }

    setIsLocating(true);
    setFormError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geoData: IGeoLocationData = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            speed: position.coords.speed,
            heading: position.coords.heading
          },
          timestamp: position.timestamp
        };

        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));

        // Call Nominatim API for reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=jsonv2`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.address) {
              const addr = data.address;
              const completedGeoData: IGeoLocationData = {
                ...geoData,
                address: {
                  country: addr.country || 'Ecuador',
                  countryCode: (addr.country_code || 'EC').toUpperCase(),
                  state: addr.state || addr.region || '',
                  city: addr.city || addr.town || addr.village || addr.municipality || '',
                  neighborhood: addr.neighbourhood || addr.suburb || addr.quarter || '',
                  street: addr.road || '',
                  streetNumber: addr.house_number || '',
                  postalCode: addr.postcode || null,
                  formattedAddress: data.display_name || ''
                }
              };
              setGpsData(completedGeoData);

            } else {
              setGpsData(geoData);
            }
          })
          .catch((err) => {
            console.error('Error in reverse geocoding:', err);
            setGpsData(geoData);
          })
          .finally(() => {
            setIsLocating(false);
          });
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setFormError('Permiso de geolocalización denegado.');
            break;
          case error.POSITION_UNAVAILABLE:
            setFormError('La ubicación actual no está disponible.');
            break;
          case error.TIMEOUT:
            setFormError('Tiempo de espera agotado al obtener ubicación.');
            break;
          default:
            setFormError('Error al obtener la ubicación real.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setFormError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedBase64 = await compressImage(file);
        setImages((prev) => [...prev, compressedBase64]);
      } catch (err) {
        console.error('Error compressing image:', err);
        setFormError('No se pudo procesar una de las imágenes.');
      }
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTypeId) {
      setFormError('Por favor seleccione un tipo de incidente.');
      return;
    }
    if (!reportDescription.trim()) {
      setFormError('Por favor describa el reporte.');
      return;
    }
    if (!referenceAddress.trim()) {
      setFormError('Por favor ingrese la dirección de referencia.');
      return;
    }
    if (!latitude || !longitude) {
      setFormError('Por favor capture la ubicación GPS.');
      return;
    }
    if (images.length === 0) {
      setFormError('Por favor cargue al menos una imagen de evidencia.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createIncident({
        connectionId: connectionId.trim() || null,
        readingId: readingId ? Number(readingId) : null,
        incidentTypeId: Number(incidentTypeId),
        reportDescription: reportDescription.trim(),
        referenceAddress: referenceAddress.trim() || null,
        reportOrigin,
        priority,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        images: images.length > 0 ? images : []
      });
      navigate('/incidents/list');
    } catch (err: any) {
      setFormError(err.message || 'Error al reportar el incidente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        className="create-incident-page"
        header={
          <div className="create-incident-header">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/incidents/list')}
              leftIcon={<ArrowLeft size={16} />}
              style={{ paddingLeft: 0 }}
            >
              Volver a la lista
            </Button>
            <h2 className="create-incident-title">Reportar Nuevo Incidente Técnico</h2>
          </div>
        }
      >
        <div className="create-incident-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress size={80} label="Cargando categorías..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      className="create-incident-page"
      header={
        <div className="create-incident-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/incidents/list')}
            leftIcon={<ArrowLeft size={16} />}
            style={{ paddingLeft: 0 }}
          >
            Volver a la lista
          </Button>
          <h2 className="create-incident-title">Reportar Nuevo Incidente Técnico</h2>
        </div>
      }
    >
      <div className="create-incident-card">
        <form onSubmit={handleSubmit} className="create-incident-form">
          <SearchToolbar
            cadastralKeyInput={connectionId}
            setCadastralKeyInput={setConnectionId}
            handleSearch={handleSearch}
            handleCancel={handleCancel}
            isLoadingInfo={isLoadingInfo}
            isSubmitting={isSubmitting}
            readingInfo={activeReadingInfo}
            method="create"
          />

          {activeReadingInfo && (
            <AdditionalInfoAccordion info={activeReadingInfo} />
          )}
          <br />


          <div className="form-group">
            <label className="input__label">Tipo de Incidente *</label>
            <div
              className={`incident-type-selector-trigger ${incidentTypeId ? 'has-value' : ''}`}
              onClick={() => setIsTypeModalOpen(true)}
            >
              <div className="selected-type-info">
                {selectedIncidentTypeObj ? (
                  <>
                    <span
                      className="type-icon-badge"
                      style={{
                        backgroundColor: getCategoryDetails(selectedIncidentTypeObj.categoryName).color
                      }}
                    >
                      {getCategoryDetails(selectedIncidentTypeObj.categoryName).icon}
                    </span>
                    <div className="selected-type-text">
                      <span className="selected-category-name">{selectedIncidentTypeObj.categoryName}</span>
                      <span className="selected-type-name">{selectedIncidentTypeObj.typeName}</span>
                    </div>
                  </>
                ) : (
                  <span className="placeholder-text">-- Seleccione un tipo de incidente --</span>
                )}
              </div>
              <ChevronDown size={16} className="trigger-chevron" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Select
                label="Prioridad *"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                size="compact"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </Select>
            </div>

            <div className="form-group">
              <Select
                label="Origen del Reporte *"
                value={reportOrigin}
                onChange={(e) => setReportOrigin(e.target.value as any)}
                size="compact"
              >
                <option value="WEB_USUARIO">Web de Usuario</option>
                <option value="LECTURISTA">Lecturista</option>
                <option value="ATENCION_AL_CLIENTE">Atención al Cliente</option>
                <option value="INSPECTOR">Inspector</option>
              </Select>
            </div>
          </div>

          <div className="form-group">
            <TextArea
              label="Descripción detallada del reporte *"
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describa el problema detalladamente..."
              required
              size="compact"
            />
          </div>

          <div className="form-group">
            <Input
              label="Dirección de Referencia *"
              type="text"
              value={referenceAddress}
              onChange={(e) => setReferenceAddress(e.target.value)}
              placeholder="Ej. Calle 10 de Agosto y Av. América"
              size="compact"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Input
                label="Latitud *"
                type="text"
                value={latitude}
                placeholder="No capturada"
                size="compact"
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <Input
                label="Longitud *"
                type="text"
                value={longitude}
                placeholder="No capturada"
                size="compact"
                readOnly
                disabled
              />
            </div>
          </div>

          {gpsData && (
            <div className="gps-metadata-container">
              <div className="gps-metadata-item">
                <span className="gps-metadata-label">Precisión:</span>
                <span className="gps-metadata-value">± {gpsData.coords.accuracy.toFixed(2)} m</span>
              </div>
              {gpsData.coords.altitude !== null && (
                <div className="gps-metadata-item">
                  <span className="gps-metadata-label">Altitud:</span>
                  <span className="gps-metadata-value">{gpsData.coords.altitude.toFixed(2)} m</span>
                </div>
              )}
              <div className="gps-metadata-item">
                <span className="gps-metadata-label">Captura:</span>
                <span className="gps-metadata-value">
                  {new Date(gpsData.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="gps-metadata-item">
                <span className="gps-metadata-label">Latitud:</span>
                <span className="gps-metadata-value">
                  {gpsData.coords.latitude}
                </span>
              </div>
              <div className="gps-metadata-item">
                <span className="gps-metadata-label">Longitud:</span>
                <span className="gps-metadata-value">
                  {gpsData.coords.longitude}
                </span>
              </div>
            </div>
          )}

          {gpsData && gpsData.address && (
            <div className="gps-address-card">
              <div className="gps-address-card__header">
                <MapPin size={14} className="gps-address-card__icon" />
                <span className="gps-address-card__title">Dirección de Ubicación Actual (Geocodificada)</span>
              </div>
              <div className="gps-address-card__body">
                <div className="address-grid">
                  <div className="address-field">
                    <span className="address-field-label">Calle Principal</span>
                    <span className="address-field-value">
                      {gpsData.address.street || 'No disponible'} {gpsData.address.streetNumber}
                    </span>
                  </div>
                  <div className="address-field">
                    <span className="address-field-label">Barrio / Sector</span>
                    <span className="address-field-value">{gpsData.address.neighborhood || 'No disponible'}</span>
                  </div>
                  <div className="address-field">
                    <span className="address-field-label">Ciudad / Cantón</span>
                    <span className="address-field-value">{gpsData.address.city || 'No disponible'}</span>
                  </div>
                  <div className="address-field">
                    <span className="address-field-label">Provincia</span>
                    <span className="address-field-value">{gpsData.address.state || 'No disponible'}</span>
                  </div>
                  <div className="address-field">
                    <span className="address-field-label">País</span>
                    <span className="address-field-value">
                      {gpsData.address.country} ({gpsData.address.countryCode})
                    </span>
                  </div>
                  <div className="address-field">
                    <span className="address-field-label">Cód. Postal</span>
                    <span className="address-field-value">{gpsData.address.postalCode || 'No disponible'}</span>
                  </div>
                </div>
                <div className="address-full">
                  <span className="address-field-label">Dirección Completa</span>
                  <span className="address-full-value">{gpsData.address.formattedAddress}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <Button
              type="button"
              variant="outline"
              size="compact"
              onClick={handleGetLocation}
              isLoading={isLocating}
              leftIcon={<MapPin size={16} />}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Obtener Ubicación GPS Actual
            </Button>
            {latitude && longitude && (
              <Button
                type="button"
                variant="outline"
                size="compact"
                onClick={() => setShowMap(!showMap)}
                leftIcon={<MapPin size={16} />}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {showMap ? 'Ocultar Mapa de Ajuste' : 'Ver y Ajustar en el Mapa'}
              </Button>
            )}
          </div>

          {showMap && (
            <div className="gps-map-wrapper">
              <span className="gps-map-instruction">
                📍 Arrastra el marcador o haz clic en el mapa para ajustar la ubicación exacta.
              </span>
              <div id="incident-map" className="incident-map-container" />
            </div>
          )}

          <div className="form-group">
            <label className="input__label">Imágenes de Evidencia *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div className="evidence-upload-container">
              {/* Uploader Box */}
              <div
                className="evidence-upload-trigger-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={20} className="upload-trigger-icon" />
                <span className="upload-trigger-text">Cargar</span>
              </div>

              {/* Image Previews */}
              {images.map((img, idx) => (
                <div key={idx} className="evidence-image-preview-wrapper">
                  <img src={img} alt={`evidencia-${idx}`} className="evidence-image-preview" />
                  <button
                    type="button"
                    className="evidence-image-remove-btn"
                    onClick={() => handleRemoveImage(idx)}
                    title="Eliminar imagen"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {formError && (
            <div className="incident-error-banner" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="incident-form-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
            <Button type="button" variant="outline" onClick={() => navigate('/incidents/list')} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Reportando...' : 'Reportar Incidente'}
            </Button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title="Seleccionar Tipo de Incidente"
        size="lg"
      >
        <div className="incident-categories-modal-body">
          {categories.map((category) => {
            const details = getCategoryDetails(category.categoryName);
            return (
              <div key={category.categoryName} className="category-section">
                <div className="category-section-header" style={{ color: details.color }}>
                  {details.iconLg}
                  <h3>{category.categoryName}</h3>
                </div>
                <div className="types-grid">
                  {category.incidentTypes.map((type: any) => {
                    const isSelected = String(type.typeCode) === incidentTypeId;
                    return (
                      <div
                        key={type.typeCode}
                        className={`type-selection-card ${isSelected ? 'selected' : ''}`}
                        style={{
                          '--theme-color': details.color,
                          '--theme-bg': details.bgColor,
                          '--theme-border': details.borderColor
                        } as React.CSSProperties}
                        onClick={() => {
                          setIncidentTypeId(String(type.typeCode));
                          setIsTypeModalOpen(false);
                        }}
                      >
                        <div className="type-card-icon-wrapper">
                          {details.icon}
                        </div>
                        <span className="type-card-name">{type.typeName}</span>
                        {isSelected && (
                          <div className="type-card-selected-badge">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </PageLayout>
  );
};
