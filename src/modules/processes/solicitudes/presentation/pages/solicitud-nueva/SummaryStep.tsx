import React, { useState, useEffect } from 'react';
import { 
  FileText, MapPin, Globe, Compass, 
  FileCheck, Landmark, Phone, Mail, 
  User, DollarSign, Calendar, Sparkles, ShieldCheck
} from 'lucide-react';
import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from './types';
import { GetCountriesRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetCountriesRepositoryImpl';
import { GetProvincesRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetProvincesRepositoryImpl';
import { GetCantonRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetCantonRepositoryImpl';
import { GetParishRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetParishRepositoryImpl';
import { GetCountriesUseCase } from '@/modules/location/application/usecases/GetCountriesUseCase';
import { GetProvincesUseCase } from '@/modules/location/application/usecases/GetProvincesUseCase';
import { GetCantonUseCase } from '@/modules/location/application/usecases/GetCantonUseCase';
import { GetParishUseCase } from '@/modules/location/application/usecases/GetParishUseCase';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

interface SummaryStepProps {
  form: SolicitudForm;
  tramite?: Tramite | null;
  documentos: DocumentosMap;
  allDocsReady: boolean;
  docsSubidos: number;
  docsTotal: number;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  form,
  tramite,
  documentos,
  allDocsReady,
  docsSubidos,
  docsTotal
}) => {
  const [resolvedLocation, setResolvedLocation] = useState({
    country: '',
    province: '',
    canton: '',
    parish: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolveNames = async () => {
      const { countryId, provinceId, cantonId, parishId } = form.detalles || {};
      if (!countryId && !provinceId && !cantonId && !parishId) return;

      setLoading(true);
      try {
        const countriesUseCase = new GetCountriesUseCase(new GetCountriesRepositoryImpl(apiClient));
        const provincesUseCase = new GetProvincesUseCase(new GetProvincesRepositoryImpl(apiClient));
        const cantonUseCase = new GetCantonUseCase(new GetCantonRepositoryImpl(apiClient));
        const parishUseCase = new GetParishUseCase(new GetParishRepositoryImpl(apiClient));

        let countryName = countryId || '';
        let provinceName = provinceId || '';
        let cantonName = cantonId || '';
        let parishName = parishId || '';

        if (countryId) {
          const countries = await countriesUseCase.getAllCountries();
          const match = countries.find(c => c.countryId === countryId);
          if (match) countryName = match.countryName;
        }

        if (provinceId && countryId) {
          const provinces = await provincesUseCase.getProvincesByCountryId(countryId);
          const match = provinces.find(p => p.provinceId === provinceId);
          if (match) provinceName = match.provinceName;
        }

        if (cantonId && provinceId) {
          const cantons = await cantonUseCase.getCantonsByProvinceId(provinceId);
          const match = cantons.find(c => c.cantonId === cantonId);
          if (match) cantonName = match.cantonName;
        }

        if (parishId && cantonId) {
          const parishes = await parishUseCase.getParishesByCantonId(cantonId);
          const match = parishes.find(p => p.parishId === parishId);
          if (match) parishName = match.parishName;
        }

        setResolvedLocation({
          country: countryName,
          province: provinceName,
          canton: cantonName,
          parish: parishName
        });
      } catch (error) {
        console.error('Error resolving location names:', error);
      } finally {
        setLoading(false);
      }
    };

    resolveNames();
  }, [form.detalles]);

  // Filter out location ID keys and legacy parish name
  const dynamicKeys = Object.entries(form.detalles || {}).filter(([key]) => {
    const k = key.toLowerCase();
    return (
      k !== 'countryid' &&
      k !== 'provinceid' &&
      k !== 'cantonid' &&
      k !== 'parishid' &&
      k !== 'parroquia'
    );
  });

  return (
    <div className="solicitud-form-section summary-step-premium">
      <div className="solicitud-form-section__header">
        <FileText size={20} className="header-icon-premium" />
        <h3>Resumen de la Solicitud</h3>
      </div>
      
      <p className="summary-step-premium__intro">
        Revisa los datos de tu trámite antes de enviarlo. Asegúrate de que toda la información ingresada sea verídica.
      </p>

      <div className="summary-grid-premium">
        
        {/* CARD 1: DATOS DEL SOLICITANTE */}
        <div className="summary-card-premium">
          <div className="summary-card-premium__header card-header--user">
            <User size={16} />
            <h4>Datos Personales</h4>
          </div>
          <div className="summary-card-premium__content">
            <div className="summary-card-premium__row">
              <span className="premium-label"><User size={13} /> Nombres:</span>
              <strong className="premium-value">{form.nombres} {form.apellidos}</strong>
            </div>
            <div className="summary-card-premium__row">
              <span className="premium-label"><ShieldCheck size={13} /> Cédula:</span>
              <strong className="premium-value">{form.cedula}</strong>
            </div>
            <div className="summary-card-premium__row">
              <span className="premium-label"><Mail size={13} /> Correo:</span>
              <strong className="premium-value">{form.email}</strong>
            </div>
            <div className="summary-card-premium__row">
              <span className="premium-label"><Phone size={13} /> Teléfono:</span>
              <strong className="premium-value">{form.telefono}</strong>
            </div>
          </div>
        </div>

        {/* CARD 2: DETALLES DEL TRÁMITE */}
        <div className="summary-card-premium">
          <div className="summary-card-premium__header card-header--service" style={{ '--accent-color': tramite?.color || '#3b82f6' } as React.CSSProperties}>
            <Sparkles size={16} />
            <h4>Servicio Solicitado</h4>
          </div>
          <div className="summary-card-premium__content">
            <div className="summary-card-premium__row">
              <span className="premium-label">Trámite:</span>
              <strong className="premium-value text-accent-highlight" style={{ color: tramite?.color || '#3b82f6' }}>{tramite?.nombre}</strong>
            </div>
            <div className="summary-card-premium__row">
              <span className="premium-label"><User size={13} /> Tipo Persona:</span>
              <strong className="premium-value status-badge-premium">{form.tipo_persona === 'JURIDICA' ? 'Persona Jurídica' : 'Persona Natural'}</strong>
            </div>
            {tramite?.costoTotal !== undefined && (
              <div className="summary-card-premium__row">
                <span className="premium-label"><DollarSign size={13} /> Costo Estimado:</span>
                <strong className="premium-value text-success">${tramite.costoTotal.toFixed(2)}</strong>
              </div>
            )}
            {tramite?.tiempoEstimadoDias !== undefined && (
              <div className="summary-card-premium__row">
                <span className="premium-label"><Calendar size={13} /> Tiempo Estimado:</span>
                <strong className="premium-value">{tramite.tiempoEstimadoDias} días hábiles</strong>
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: UBICACIÓN DEL PREDIO (RESOLVED NAMES!) */}
        {(loading || resolvedLocation.country || resolvedLocation.province || resolvedLocation.canton || resolvedLocation.parish) && (
          <div className="summary-card-premium">
            <div className="summary-card-premium__header card-header--location">
              <MapPin size={16} />
              <h4>Ubicación del Predio</h4>
            </div>
            <div className="summary-card-premium__content">
              {loading ? (
                <div className="summary-loading-spinner">
                  <div className="spinner-dot"></div>
                  <span>Resolviendo ubicación...</span>
                </div>
              ) : (
                <>
                  {resolvedLocation.country && (
                    <div className="summary-card-premium__row">
                      <span className="premium-label"><Globe size={13} /> País:</span>
                      <strong className="premium-value">{resolvedLocation.country}</strong>
                    </div>
                  )}
                  {resolvedLocation.province && (
                    <div className="summary-card-premium__row">
                      <span className="premium-label"><Landmark size={13} /> Provincia:</span>
                      <strong className="premium-value">{resolvedLocation.province}</strong>
                    </div>
                  )}
                  {resolvedLocation.canton && (
                    <div className="summary-card-premium__row">
                      <span className="premium-label"><Compass size={13} /> Ciudad/Cantón:</span>
                      <strong className="premium-value">{resolvedLocation.canton}</strong>
                    </div>
                  )}
                  {resolvedLocation.parish && (
                    <div className="summary-card-premium__row">
                      <span className="premium-label"><MapPin size={13} /> Parroquia:</span>
                      <strong className="premium-value">{resolvedLocation.parish}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* CARD 4: DETALLES ADICIONALES (SI APLICAN) */}
        {dynamicKeys.length > 0 && (
          <div className="summary-card-premium">
            <div className="summary-card-premium__header card-header--additional">
              <FileText size={16} />
              <h4>Información Adicional</h4>
            </div>
            <div className="summary-card-premium__content">
              {dynamicKeys.map(([key, value]) => {
                const labelMap: Record<string, string> = {
                  barrio: 'Barrio / Sector',
                  calle_principal: 'Calle Principal',
                  calle_secundaria: 'Calle Secundaria',
                  referencia: 'Referencia',
                  tipo_uso: 'Tipo de Uso',
                  diametro_solicitado: 'Diámetro Solicitado',
                  observaciones: 'Observaciones Adicionales'
                };
                const label = labelMap[key] || key.replace(/_/g, ' ');
                return (
                  <div className="summary-card-premium__row" key={key}>
                    <span className="premium-label">{label}:</span>
                    <strong className="premium-value">{String(value) || 'No especificado'}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CARD 5: DOCUMENTOS ADJUNTOS */}
        <div className="summary-card-premium summary-card-premium--fullwidth">
          <div className="summary-card-premium__header card-header--docs">
            <FileCheck size={16} />
            <h4>Documentación Adjunta</h4>
            <span className={`docs-badge-premium ${allDocsReady ? 'docs-badge-premium--ready' : 'docs-badge-premium--warning'}`}>
              {docsSubidos} / {docsTotal} cargados
            </span>
          </div>
          <div className="summary-card-premium__content">
            <div className="docs-list-premium">
              {Object.values(documentos).length === 0 ? (
                <p className="no-docs-message-premium">No se han cargado documentos en este paso.</p>
              ) : (
                Object.values(documentos).map((doc) => {
                  const req = tramite?.requisitos.find((r) => r.id === doc.requisitoId);
                  return (
                    <div key={doc.requisitoId} className="doc-item-premium">
                      <div className="doc-item-premium__info">
                        <span className="doc-item-premium__number">✓</span>
                        <div className="doc-item-premium__meta">
                          <span className="doc-item-premium__req-name">
                            {req?.descripcion || 'Documento adjunto'}
                          </span>
                          <span className="doc-item-premium__file-name">
                            {doc.file.name}
                          </span>
                        </div>
                      </div>
                      <span className="doc-item-premium__status-text">
                        Listo para enviar
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
