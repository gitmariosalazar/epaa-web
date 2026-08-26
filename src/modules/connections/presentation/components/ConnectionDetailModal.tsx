import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';

import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { getConnectionStateChip } from '../utils/connectionStateChip';
import type { ConnectionWithoutProperty } from '../../domain/models/Connection';
import {
  Building,
  User,
  MapPin,
  Info,
  History,
  Settings,
  AlertTriangle,
  Phone,
  Mail,
  Check,
  X,
  Pause
} from 'lucide-react';
import { useConnectionsContext } from '../context/ConnectionContext';
import { ReadingHistoryTable } from '@/modules/readings/presentation/components/ReadingHistoryTable';
import type { ReadingHistory } from '@/modules/readings/domain/models/ReadingHistory';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import type { HistoryMeters } from '../../domain/models/Connection';
import { decodeEWKBPoint } from '@/shared/utils/geoUtils';
import './ConnectionDetailModal.css';

interface ConnectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cadastralKey: string | null;
}

export const ConnectionDetailModal: React.FC<ConnectionDetailModalProps> = ({
  isOpen,
  onClose,
  cadastralKey
}) => {
  const { t } = useTranslation();
  const { findAllConnectionsWithPropertyUseCase } = useConnectionsContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionData, setConnectionData] = useState<ConnectionWithoutProperty | null>(null);
  const [activeTab, setActiveTab] = useState<string>('section-general');
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);

  const loadingProgress = useSimulatedProgress(loading);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      if (!isOpen || !cadastralKey) return;

      setLoading(true);
      setError(null);
      try {
        const results = await findAllConnectionsWithPropertyUseCase.execute({
          limit: 1,
          offset: 0,
          query: cadastralKey
        });

        if (isMounted) {
          if (results && results.length > 0) {
            setConnectionData(results[0]);
          } else {
            setError(t('connections.table.noData', 'No se encontraron datos para esta acometida.'));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(t('connections.table.fetchError', 'Error al cargar los detalles de la acometida.'));
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, cadastralKey, findAllConnectionsWithPropertyUseCase, t]);

  const handleClose = () => {
    setActiveTab('general');
    setConnectionData(null);
    onClose();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTab(id);
    }
  };

  const navItems = [
    { id: 'section-general', label: t('connections.detail.general', 'Informacion Basica'), icon: <Info size={16} /> },
    { id: 'section-client', label: t('connections.detail.client', 'Datos del Cliente'), icon: <User size={16} /> },
    { id: 'section-readings', label: t('connections.detail.readings', 'Historial de Lecturas'), icon: <History size={16} /> },
    { id: 'section-meters', label: t('connections.detail.meters', 'Historial de Medidores'), icon: <Settings size={16} /> }
  ];

  const renderGeneralInfo = () => {
    if (!connectionData) return null;
    const statusChip = getConnectionStateChip(connectionData.connectionStatus);

    return (
      <div id="section-general" className="connection-section-card connection-general-grid">
        <div className="connection-info-column">
          <h3 className="connection-section-title">
            <Info size={18} /> Información Principal
          </h3>
          <div className="connection-data-grid">
            <strong className="connection-data-label">C. Catastral:</strong>
            <span>{connectionData.connectionCadastralKey || '-'}</span>

            <strong className="connection-data-label">Cuenta:</strong>
            <span>{connectionData.connectionAccount || '-'}</span>

            <strong className="connection-data-label">Medidor:</strong>
            <span>{connectionData.connectionMeterNumber || '-'}</span>

            <strong className="connection-data-label">Contrato:</strong>
            <span>{connectionData.connectionContractNumber || '-'}</span>

            <strong className="connection-data-label">Estado:</strong>
            <div><ColorChip label={statusChip.label} color={statusChip.color} icon={statusChip.icon} variant="soft" size="sm" /></div>

            <strong className="connection-data-label">Tarifa:</strong>
            <div><ColorChip label={connectionData.connectionRateName || '-'} variant="ghost" size="sm" /></div>
          </div>
        </div>

        <div className="connection-info-column">
          <h3 className="connection-section-title">
            <MapPin size={18} /> Ubicación
          </h3>
          <div className="connection-data-grid">
            <strong className="connection-data-label">Sector:</strong>
            <span>{connectionData.connectionSector || '-'}</span>

            <strong className="connection-data-label">Zona:</strong>
            <span>{connectionData.zoneName ? `${connectionData.zoneCode} - ${connectionData.zoneName}` : '-'}</span>

            <strong className="connection-data-label">Dirección:</strong>
            <span>{connectionData.connectionAddress || '-'}</span>

            <strong className="connection-data-label">Referencia:</strong>
            <span>{connectionData.connectionReference || '-'}</span>

            <strong className="connection-data-label">Coordenadas:</strong>
            <span className="connection-data-coords">
              {(() => {
                const coords = connectionData.connectionCoordinates ? decodeEWKBPoint(connectionData.connectionCoordinates) : null;
                return coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : '-';
              })()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderClientInfo = () => {
    if (!connectionData) return null;
    const isCompany = !!connectionData.company;
    const client = isCompany ? connectionData.company : connectionData.person;

    if (!client) return <div id="section-client" className="connection-empty-state">No hay información de cliente disponible.</div>;

    const name = isCompany ? connectionData.company?.businessName : `${connectionData.person?.firstName || ''} ${connectionData.person?.lastName || ''}`.trim();
    const identifier = isCompany ? connectionData.company?.ruc : connectionData.clientId;

    return (
      <div id="section-client" className="connection-section-card connection-client-section">
        <h3 className="connection-section-title">
          <User size={18} /> Datos del Cliente
        </h3>
        <div className="connection-client-header">
          <Avatar name={name || ' '} size="lg" />
          <div>
            <h2 className="connection-client-name">
              {isCompany ? <Building size={20} /> : <User size={20} />}
              {name}
            </h2>
            <ColorChip label={identifier} variant="ghost" size="sm" />
          </div>
        </div>

        <div className="connection-contact-grid">
          <div className="connection-contact-column">
            <div className="connection-contact-item">
              <MapPin size={16} /> <span>{client.address || 'Sin dirección registrada'}</span>
            </div>
            <div className="connection-contact-item">
              <Phone size={16} />
              <span>
                {client.phones && client.phones.length > 0
                  ? client.phones.map(phone => phone.numero).join(', ')
                  : 'Sin teléfonos'}
              </span>
            </div>
            <div className="connection-contact-item">
              <Mail size={16} />
              <span>
                {client.emails && client.emails.length > 0
                  ? client.emails.map(email => email.email).join(', ')
                  : 'Sin correos'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReadingsHistory = () => {
    if (!connectionData || !connectionData.lastReadings || connectionData.lastReadings.length === 0) {
      return (
        <div id="section-readings" className="connection-empty-state">
          <History size={48} className="connection-empty-icon" />
          <p>No hay historial de lecturas para esta acometida.</p>
        </div>
      );
    }

    const mappedReadings: ReadingHistory[] = connectionData.lastReadings.map((lr, idx) => {
      const current = Number(lr.readingValueCurrent) || 0;
      const previous = Number(lr.readingValuePreview) || 0;
      const date = new Date(lr.readingDate);
      return {
        readingId: idx + 1,
        connectionId: lr.cadastralKey,
        readingYear: isNaN(date.getFullYear()) ? 0 : date.getFullYear(),
        readingMonth: lr.readingMonth || '',
        readingDate: date,
        readingTime: lr.readingTime || '00:00:00',
        previousReading: previous,
        currentReading: current,
        consumption: current - previous,
        observation: lr.novelty || 'NOT_READ',
        readingValue: 0 // LastReading doesn't include the monetary value
      } as ReadingHistory;
    });

    return (
      <div id="section-readings" className="connection-section-card connection-table-section">
        <h3 className="connection-section-title connection-section-title-mb">
          <History size={18} /> Historial de Lecturas
        </h3>
        <ReadingHistoryTable history={mappedReadings} isLoading={false} />
      </div>
    );
  };

  const renderMetersHistory = () => {
    if (!connectionData || !connectionData.historyMeters || connectionData.historyMeters.length === 0) {
      return (
        <div id="section-meters" className="connection-empty-state">
          <Settings size={48} className="connection-empty-icon" />
          <p>No hay historial de cambios de medidor para esta acometida.</p>
        </div>
      );
    }

    const meterColumns: Column<HistoryMeters>[] = [
      {
        header: 'Fecha Inst.',
        accessor: (row) => row.installationDate ? new Date(row.installationDate).toLocaleDateString() : '-',
        id: 'installationDate'
      },
      {
        header: 'Fecha Desinst.',
        accessor: (row) => row.uninstallationDate ? new Date(row.uninstallationDate).toLocaleDateString() : '-',
        id: 'uninstallationDate'
      },
      {
        header: 'Medidor Ant.',
        accessor: (row) => <ColorChip label={row.previousMeter || '-'} variant="ghost" size="xs" />,
        id: 'previousMeter'
      },
      {
        header: 'Medidor Nuevo',
        accessor: (row) => <ColorChip label={row.newMeter || '-'} color="var(--primary)" variant="soft" size="xs" />,
        id: 'newMeter'
      },
      {
        header: 'Estado',
        accessor: (row) => <ColorChip label={row.status || '-'} variant="soft" size="xs"
          color={
            row.status === 'ACTIVO' ? 'var(--success)' :
              row.status === 'INACTIVO' ? 'var(--error)' :
                row.status === 'SUSPENDIDO' ? 'var(--warning)' : 'var(--gray)'
          }
          icon={
            row.status === 'ACTIVO' ? <Check size={12} /> :
              row.status === 'INACTIVO' ? <X size={12} /> :
                row.status === 'SUSPENDIDO' ? <Pause size={12} /> : null
          }
        />,
        id: 'status'
      },
      {
        header: 'Observación',
        accessor: (row) => (
          <div className="connection-observation-cell">
            {row.observation || '-'}
          </div>
        ),
        id: 'observation'
      }
    ];

    return (
      <div id="section-meters" className="connection-section-card connection-table-section">
        <h3 className="connection-section-title connection-section-title-mb">
          <Settings size={18} /> Historial de Medidores
        </h3>
        <Table<HistoryMeters>
          columns={meterColumns}
          data={connectionData.historyMeters}
          isLoading={false}
          pagination={true}
          pageSize={5}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Detalles de Acometida: ${cadastralKey || ''}`}
      size="xxl"

    >
      <div className="connection-modal-body">
        {loading ? (
          <div className="connection-loading-state">
            <CircularProgress
              progress={loadingProgress}
              size={100}
              strokeWidth={8}
              label={t('common.loading', 'Cargando detalles...')}
            />
          </div>
        ) : error ? (
          <div className="connection-error-state">
            <AlertTriangle size={48} />
            <p>{error}</p>
          </div>
        ) : connectionData ? (
          <div className="connection-content-layout">
            {/* Sidebar Navigation */}
            <div
              onMouseEnter={() => setIsNavExpanded(true)}
              onMouseLeave={() => setIsNavExpanded(false)}
              className={`connection-sidebar ${isNavExpanded ? 'expanded' : 'collapsed'}`}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  title={!isNavExpanded ? item.label : undefined}
                  className={`connection-nav-item ${activeTab === item.id ? 'active' : 'inactive'}`}
                >
                  <div className="connection-nav-icon">
                    {item.icon}
                  </div>

                  <span className="connection-nav-label">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="connection-scrollable-content custom-scrollbar">
              {renderGeneralInfo()}
              {renderClientInfo()}
              {renderReadingsHistory()}
              {renderMetersHistory()}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
