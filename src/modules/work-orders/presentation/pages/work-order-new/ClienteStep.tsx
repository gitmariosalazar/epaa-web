/**
 * ClienteStep — Paso 1 del wizard de creación de OT
 *
 * CLEAN ARCHITECTURE:
 *   - Usa `FindConnectionAndPropertyByCadastralKeyOrCardIdUseCase` (application layer)
 *     para buscar acometidas por cédula o clave catastral.
 *   - El endpoint retorna acometidas + datos del cliente, eliminando búsquedas separadas.
 *
 * SOLID:
 *   - SRP  : busca acometidas, muestra tabla para selección, auto-llena form.
 *   - OCP  : `ConnectionsTable` sub-componente independiente y extensible.
 *   - DIP  : depende de abstracciones (use case → repository interface).
 *   - ISP  : cada sub-componente recibe solo props necesarias.
 */
import React, { useState, useMemo } from 'react';
import { User, Mail, Phone, Edit, MapPin, Search, X } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';

// ── Clean Architecture: Use Case + Repository (DIP) ─────────────────────────
import { FindConnectionAndPropertyByCadastralKeyOrCardIdUseCase } from '@/modules/connections/application/usecases/FindConnectionAndPropertyByCadastralKeyOrCardIdUseCase';
import { ConnectionRepositoryImpl } from '@/modules/connections/infrastructure/repositories/ConnectionRepositoryImpl';
import type { ConnectionAndPropertyResponse } from '@/modules/connections/domain/models/Connection';
import { decodeEWKBPoint } from '@/shared/utils/geoUtils';

// ── Shared components ───────────────────────────────────────────────────────
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

import { ConnectionStateChip } from '@/shared/presentation/components/chip/ConnectionStateChip';
import { Alert } from '@/shared/presentation/components/Alert';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { WorkOrderForm } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ConnectionsTable — Sub-componente (SRP: solo renderiza la tabla de acometidas)
// ═══════════════════════════════════════════════════════════════════════════════
interface ConnectionsTableProps {
  connections: ConnectionAndPropertyResponse[];
  selectedId: string | null;
  onSelect: (conn: ConnectionAndPropertyResponse) => void;
}

const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections, selectedId, onSelect,
}) => {
  if (connections.length === 0) return null;

  return (
    <div className="wo-connections-table-wrapper">
      <div className="wo-connections-table-header">
        <MapPin size={16} />
        <span>Acometidas encontradas ({connections.length}) — Seleccione una</span>
      </div>
      <div className="wo-connections-table-scroll">
        <table className="wo-connections-table">
          <thead>
            <tr>
              <th></th>
              <th>Clave Catastral</th>
              <th>Dirección</th>
              <th>Medidor</th>
              <th>Tarifa</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {connections.map(conn => {
              const isSelected = conn.connectionId === selectedId;
              return (
                <tr
                  key={conn.connectionId}
                  className={`wo-connections-table-row ${isSelected ? 'wo-connections-table-row--selected' : ''}`}
                  onClick={() => onSelect(conn)}
                >
                  <td>
                    <div className={`wo-radio ${isSelected ? 'wo-radio--active' : ''}`}>
                      {isSelected && <div className="wo-radio-dot" />}
                    </div>
                  </td>
                  <td className="wo-connections-cell--key">
                    {conn.connectionCadastralKey || '—'}
                  </td>
                  <td>{conn.connectionAddress || '—'}</td>
                  <td>{conn.connectionMeterNumber || '—'}</td>
                  <td>{conn.connectionRateName || '—'}</td>
                  <td>
                    {conn.connectionStatus ? (
                      <ConnectionStateChip statusName={conn.connectionStatus} size="sm" variant="soft" />
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ClienteStep — Componente principal
// ═══════════════════════════════════════════════════════════════════════════════
interface ClienteStepProps {
  form: WorkOrderForm;
  onFormChange: (fields: Partial<WorkOrderForm>) => void;
  errors?: Record<string, string>;
}

export const ClienteStep: React.FC<ClienteStepProps> = ({
  form, onFormChange, errors,
}) => {
  // ── DIP: inyección directa vía useMemo (no depende de contexto) ────────
  const findConnectionUseCase = useMemo(
    () => new FindConnectionAndPropertyByCadastralKeyOrCardIdUseCase(new ConnectionRepositoryImpl()),
    []
  );

  // ── Estado local ──────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [connections, setConnections] = useState<ConnectionAndPropertyResponse[]>([]);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({ clientName: '', clientEmail: '', clientPhone: '' });

  // ── Búsqueda unificada por cédula o clave catastral ───────────────────
  const handleSearch = async () => {
    const value = searchInput.trim();
    if (!value) {
      MessageToastCustom('warning', 'Ingrese una cédula o clave catastral.', 'Búsqueda', { position: 'top-right' });
      return;
    }

    setIsSearching(true);
    setSelectedConnId(null);
    try {
      const result = await findConnectionUseCase.execute(value);
      if (result && result.length > 0) {
        setConnections(result);
        MessageToastCustom('success', `Se encontraron ${result.length} acometida(s).`, 'Encontrado', { position: 'top-right' });
        // Si solo hay una, auto-seleccionarla
        if (result.length === 1) {
          handleSelectConnection(result[0]);
        }
      } else {
        setConnections([]);
        MessageToastCustom('warning', 'No se encontraron acometidas.', 'Sin resultados', { position: 'top-right' });
      }
    } catch {
      setConnections([]);
      MessageToastCustom('error', 'Error al buscar en el servidor.', 'Error', { position: 'top-right' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setConnections([]);
    setSelectedConnId(null);
    onFormChange({
      clientId: '', clientName: '', clientEmail: '', clientPhone: '',
      tipoPersona: 'NATURAL', cadastralKey: '', location: '',
      latitude: '', longitude: '',
    });
  };

  // ── Seleccionar acometida → auto-fill cliente + acometida ─────────────
  const handleSelectConnection = (conn: ConnectionAndPropertyResponse) => {
    setSelectedConnId(conn.connectionId);

    const updates: Partial<WorkOrderForm> = {
      cadastralKey: conn.connectionCadastralKey || '',
      location: conn.connectionAddress || '',
    };

    // Extraer coordenadas (formato EWKB hex de PostGIS)
    if (conn.connectionCoordinates) {
      const decoded = decodeEWKBPoint(conn.connectionCoordinates);
      if (decoded) {
        updates.latitude = String(decoded.lat);
        updates.longitude = String(decoded.lng);
      }
    }

    // Auto-llenar datos del cliente desde la acometida
    if (conn.person) {
      updates.clientId = conn.person.personId || conn.clientId;
      updates.clientName = `${conn.person.firstName} ${conn.person.lastName}`.trim();
      updates.clientEmail = conn.person.emails?.[0]?.email || '';
      updates.clientPhone = conn.person.phones?.[0]?.numero || '';
      updates.tipoPersona = 'NATURAL';
    } else if (conn.company) {
      updates.clientId = conn.company.ruc || conn.clientId;
      updates.clientName = conn.company.businessName || conn.company.commercialName || '';
      updates.clientEmail = conn.company.emails?.[0]?.email || '';
      updates.clientPhone = conn.company.phones?.[0]?.numero || '';
      updates.tipoPersona = 'JURIDICA';
    }

    onFormChange(updates);
    MessageToastCustom('success', `Acometida ${conn.connectionCadastralKey || conn.connectionId} seleccionada.`, 'Seleccionada', { position: 'top-right' });
  };

  // ── Edit modal ────────────────────────────────────────────────────────
  const openEdit = () => {
    setEditData({ clientName: form.clientName, clientEmail: form.clientEmail, clientPhone: form.clientPhone });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    onFormChange(editData);
    setIsEditOpen(false);
    MessageToastCustom('success', 'Datos del cliente actualizados.', 'Actualizado');
  };

  const clienteEncontrado = !!form.clientName.trim();

  return (
    <div className="solicitud-form-section">

      <div className="work-order-header">
        {/* ── Search bar ────────────────────────────────────────────── */}
        <div className="solicitud-form-section__header">
          <MapPin size={20} />
          <h3>Buscar por Cédula o Clave Catastral</h3>
        </div>

        <div className="wo-search-bar"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
        >
          <Input
            name="searchInput"
            className="entry-filter-input"
            placeholder="Cédula, RUC o Clave Catastral (Ej: 1003938477 ó 14-293)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            size="compact"
          />
          <Button type="button" onClick={handleSearch} disabled={isSearching}
            leftIcon={<Search size={14} />} size="sm">
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button type="button" variant="ghost" onClick={handleClear}
            disabled={connections.length === 0 && !searchInput}
            leftIcon={<X size={14} />} size="sm" color="warning">
            Limpiar
          </Button>
        </div>

      </div>

      {/* ── Validation errors ─────────────────────────────────────── */}
      {errors?.clientId && (
        <p className="input__error" style={{ marginBottom: '0.75rem' }}>{errors.clientId}</p>
      )}
      {errors?.clientName && !errors?.clientId && (
        <p className="input__error" style={{ marginBottom: '0.75rem' }}>{errors.clientName}</p>
      )}

      {/* ── Tabla de acometidas ────────────────────────────────────── */}
      <ConnectionsTable
        connections={connections}
        selectedId={selectedConnId}
        onSelect={handleSelectConnection}
      />

      {/* ── Titular card ──────────────────────────────────────────── */}
      <div className="solicitud-titular-card">
        <div className="solicitud-titular-card__header">
          <div className="solicitud-titular-card__badge">
            <span className="solicitud-titular-card__badge-dot" />
            Titular de la Orden
          </div>
          {clienteEncontrado && (
            <div className="btn-update">
              <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}
                onClick={openEdit} type="button" className="btn-update-action">
                Actualizar Datos
              </Button>
            </div>
          )}
        </div>

        <div className="solicitud-titular-card__avatar">
          <div className="solicitur-titular-card__avatar-inner">
            {form.clientName.charAt(0) || <User />}
          </div>
          <div>
            <h4 className="solicitud-titular-card__name">
              {form.clientName.trim() || 'No registrado'}
            </h4>
            <p className="solicitud-titular-card__role">
              {clienteEncontrado ? 'Cliente encontrado en el sistema' : 'Busca por cédula o clave catastral'}
            </p>
          </div>
        </div>

        <div className="solicitud-titular-card__grid">
          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper"><User size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Cédula / RUC</span>
              <strong className="solicitud-titular-card__value">
                {form.clientId.trim() || 'Sin identificación'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--phone"><Phone size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Teléfono</span>
              <strong className="solicitud-titular-card__value">
                {form.clientPhone.trim() || 'Sin teléfono'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email"><Mail size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Correo Electrónico</span>
              <strong className="solicitud-titular-card__value">
                {form.clientEmail.trim() || 'Sin correo'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email"><FaUserCheck size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Tipo de Persona</span>
              <strong className="solicitud-titular-card__value">
                {form.tipoPersona === 'JURIDICA' ? 'Persona Jurídica' : 'Persona Natural'}
              </strong>
            </div>
          </div>

          {/* Acometida seleccionada */}
          {form.cadastralKey && (
            <div className="solicitud-titular-card__item">
              <div className="solicitud-titular-card__icon-wrapper"><MapPin size={16} /></div>
              <div>
                <span className="solicitud-titular-card__label">Acometida</span>
                <strong className="solicitud-titular-card__value">
                  {form.cadastralKey}
                </strong>
              </div>
            </div>
          )}

          <div className="solicitud-titular-card__item--full">
            <Alert type="info" title="Tip" dismissible={false}
              message="Busca por Cédula, RUC o Clave Catastral. Se mostrarán las acometidas del cliente para seleccionar. Los datos se rellenarán automáticamente." />
          </div>
        </div>
      </div>

      {/* ── Edit modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}
        title="Actualizar Datos del Cliente" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Nombre completo *" name="clientName" value={editData.clientName}
            onChange={e => setEditData(p => ({ ...p, clientName: e.target.value }))} required />
          <Input label="Correo electrónico" name="clientEmail" type="email" value={editData.clientEmail}
            onChange={e => setEditData(p => ({ ...p, clientEmail: e.target.value }))} />
          <Input label="Teléfono" name="clientPhone" value={editData.clientPhone}
            onChange={e => setEditData(p => ({ ...p, clientPhone: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
