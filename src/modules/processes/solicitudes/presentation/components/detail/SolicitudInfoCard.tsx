import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Home,
  MapPin,
  FileText,
  Navigation
} from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { BiSolidBusiness } from 'react-icons/bi';
import { FaAddressCard, FaUserCog } from 'react-icons/fa';

interface SolicitudInfoCardProps {
  solicitud: RequestDetailByClientResponse;
  titular: string;
  identificationVal: string;
  emailVal: string;
  phoneVal: string;
  personaLabel: string;
  usoLabel: string;
}

export const SolicitudInfoCard: React.FC<SolicitudInfoCardProps> = ({
  solicitud,
  titular,
  identificationVal,
  emailVal,
  phoneVal,
  personaLabel,
  usoLabel
}) => {
  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <User size={18} className="sol-detail-card__title-icon" />
        <h3 className="sol-detail-card__title">Información General</h3>
      </div>
      <div className="sol-detail-grid">
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            {identificationVal.length > 10 ? (
              <BiSolidBusiness size={12} style={{ display: 'inline', marginRight: 4 }} />
            ) : (
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />
            )}
            Nombre del Titular
          </span>
          <span className="sol-detail-item__value">{titular}</span>
        </div>
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <FaAddressCard size={12} style={{ display: 'inline', marginRight: 4 }} />
            Identificación (Cédula / RUC)
          </span>
          <span className="sol-detail-item__value">{identificationVal}</span>
        </div>
        {emailVal && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Correo Electrónico
            </span>
            <span className="sol-detail-item__value">{emailVal}</span>
          </div>
        )}
        {phoneVal && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Teléfono
            </span>
            <span className="sol-detail-item__value">{phoneVal}</span>
          </div>
        )}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <Building size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Tipo de Persona
          </span>
          <span className="sol-detail-item__value">{personaLabel}</span>
        </div>
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <Home size={12} style={{ display: 'inline', marginRight: 4 }} /> Uso
            del Predio
          </span>
          <span className="sol-detail-item__value">{usoLabel}</span>
        </div>
        <div className="sol-detail-item sol-detail-item--full">
          <span className="sol-detail-item__label">
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Dirección
          </span>
          <span className="sol-detail-item__value">{solicitud.direccion}</span>
        </div>
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Clave Catastral
          </span>
          <span className="sol-detail-item__value">
            {solicitud.claveCatastral.trim() === '' ||
              solicitud.claveCatastral === null ||
              solicitud.claveCatastral === undefined ||
              solicitud.claveCatastral.trim() === 'null'
              ? 'Sin Asignar'
              : solicitud.claveCatastral.trim()}
          </span>
        </div>
        {solicitud.coordenadas && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Navigation
                size={12}
                style={{ display: 'inline', marginRight: 4 }}
              />{' '}
              Coordenadas
            </span>
            <span className="sol-detail-item__value">
              {solicitud.coordenadas}
            </span>
          </div>
        )}
        {solicitud.analistaUsername && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <FaUserCog size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Analista Asignado
            </span>
            <span className="sol-detail-item__value">
              {solicitud.analistaNombre?.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
