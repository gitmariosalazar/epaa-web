import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
  X
} from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  DEFAULT_CONFIG
} from './IncidentMapInstantTooltip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Button } from '@/shared/presentation/components/Button/Button';
import { SearchableSelect, type SearchableSelectOption } from '@/shared/presentation/components/Input/SearchableSelect';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

// UseCases and Repositories for Clean Architecture
import { FindTechniciansUseCase } from '@/modules/users/application/usecases/FindTechniciansUseCase';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { CreateWorkOrderFromIncidentUseCase } from '@/modules/work-orders/application/usecases/CreateWorkOrderFromIncidentUseCase';
import { ProcessWorkOrderRepositoryImpl } from '@/modules/work-orders/infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// Styles
import './IncidentMapInfoWindow.css';
import { Alert } from '@/shared/presentation/components/Alert';

interface IncidentMapInfoWindowProps {
  incident: IncidentDetailRowResponse;
  theme: string;
  onClose: () => void;
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
  onViewOrder: (orderCode: string) => void;

}

/**
 * IncidentMapInfoWindow — SRP: solo renderiza el popup de info del incidente.
 * Se muestra al hacer click en un marcador.
 * ISP: recibe solo los datos que necesita, sin el contexto entero.
 */
export const IncidentMapInfoWindow: React.FC<IncidentMapInfoWindowProps> = memo(
  ({ incident, theme, onClose, onViewDetail, onViewOrder }) => {
    const pCfg = PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
    const sCfg = STATUS_CONFIG[incident.status] ?? {
      color: '#6b7280',
      label: incident.status
    };
    const isDark = theme === 'dark';

    const stopEventPropagation = useCallback((ev: React.SyntheticEvent) => {
      ev.stopPropagation();
      ev.preventDefault?.();
    }, []);

    const handleClose = useCallback(
      (ev: React.SyntheticEvent) => {
        stopEventPropagation(ev);
        onClose();
      },
      [onClose, stopEventPropagation]
    );

    const handleViewDetail = useCallback(
      (ev: React.MouseEvent) => {
        stopEventPropagation(ev);
        onViewDetail?.(incident);
      },
      [incident, onViewDetail, stopEventPropagation]
    );


    const [loading, setLoading] = useState(false);
    const [technicianId, setTechnicianId] = useState('');
    const [employees, setEmployees] = useState<SearchableSelectOption[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    useEffect(() => {
      let mounted = true;
      setLoadingEmployees(true);

      const repository = new UserRepositoryImpl();
      const useCase = new FindTechniciansUseCase(repository);

      useCase.execute('INSPECTOR')
        .then((list) => {
          if (!mounted) return;
          const opts: SearchableSelectOption[] = (list || [])
            .filter((emp: any) => emp != null)
            .map((emp: any) => {
              const firstName = emp.firstName ?? emp.first_name ?? emp.nombres ?? '';
              const lastName = emp.lastName ?? emp.last_name ?? emp.apellidos ?? '';
              const fullName = emp.fullName ?? emp.full_name ?? `${firstName} ${lastName}`.trim();
              const id = emp.userId ?? emp.user_id ?? emp.employeeId ?? emp.employee_id ?? emp.id;
              return {
                value: String(id ?? ''),
                label: fullName || id || '(sin nombre)'
              } as SearchableSelectOption;
            })
            .filter(opt => opt.value !== '');
          setEmployees(opts);
        })
        .catch(() => {
          if (mounted) setEmployees([]);
        })
        .finally(() => {
          if (mounted) setLoadingEmployees(false);
        });

      return () => { mounted = false; };
    }, []);

    const handleCreateWorkOrder = useCallback(
      async (ev: React.MouseEvent) => {
        stopEventPropagation(ev);
        setLoading(true);
        try {
          const repository = new ProcessWorkOrderRepositoryImpl();
          const useCase = new CreateWorkOrderFromIncidentUseCase(repository);

          await useCase.execute({
            incidentCode: incident.incidentCode,
            userIdAssignee: technicianId || null,
          });

          MessageToastCustom('success', 'OT Creada', `Se creó la OT para el incidente ${incident.incidentCode}`);
          onClose(); // Cerrar el popup tras crear la OT exitosamente
        } catch (error: any) {
          MessageToastCustom('error', 'Error', error.message || 'No se pudo generar la orden de trabajo');
        } finally {
          setLoading(false);
        }
      },
      [incident, technicianId, stopEventPropagation, onClose]
    );

    const canCreateOrder: boolean = technicianId !== '' && !loading;
    return (
      <div className={`premium-popup ${isDark ? 'dark' : ''}`}>
        <button
          type="button"
          className="incident-popup-close"
          onClick={handleClose}
          onMouseDown={stopEventPropagation}
          onPointerDown={stopEventPropagation}
          aria-label="Cerrar"
        >
          <X size={14} />
        </button>

        <div className="incident-popup-body">
          <div className="incident-popup-titlebar">
            <span className="incident-popup-titlebar-label">
              INFORMACIÓN BÁSICA
            </span>
            <h3 className="incident-popup-titlebar-title">
              Incidente ID: <span className='text-secondary'>{incident.incidentCode}</span>
            </h3>
          </div>

          {/* Header */}
          <div className="incident-popup-header">
            <div
              className="incident-popup-icon"
              style={{
                background: `${pCfg.color}22`,
                border: `1.5px solid ${pCfg.color}55`
              }}
            >
              <AlertTriangle size={16} color={pCfg.color} strokeWidth={2.5} />
            </div>
            <div className="incident-popup-title-block">
              <span className="incident-popup-id">
                ID: {incident.incidentCode}
              </span>
              <h3 className="incident-popup-title">
                {incident.incidentTypeName}
              </h3>
              <span className="incident-popup-category">
                {incident.categoryName}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="incident-popup-badges">
            <span
              className="incident-popup-badge"
              style={{
                background: `${pCfg.color}22`,
                color: pCfg.color,
                border: `1px solid ${pCfg.color}44`
              }}
            >
              {pCfg.label}
            </span>
            <span
              className="incident-popup-badge"
              style={{
                background: `${sCfg.color}22`,
                color: sCfg.color,
                border: `1px solid ${sCfg.color}44`
              }}
            >
              {sCfg.label}
            </span>
          </div>

          {/* Info rows */}
          <div className="incident-popup-info">
            {incident.connectionId && (
              <div className="incident-popup-info-row">
                <Tag size={12} />
                <span>
                  Acometida: <strong>{incident.connectionId}</strong>
                </span>
              </div>
            )}
            {incident.referenceAddress && (
              <div className="incident-popup-info-row">
                <MapPin size={12} />
                <span>{incident.referenceAddress}</span>
              </div>
            )}
            <div className="incident-popup-info-row">
              <Calendar size={12} />
              <span>{ConverDate(incident.reportDate)}</span>
            </div>
          </div>

          {/* Description preview */}
          {incident.reportDescription && (
            <p className="incident-popup-description">
              {incident.reportDescription.length > 80
                ? `${incident.reportDescription.slice(0, 80)}…`
                : incident.reportDescription}
            </p>
          )}

          {/* Action */}
          {onViewDetail && (
            <div
              onMouseDown={stopEventPropagation}
              onPointerDown={stopEventPropagation}
              onClick={stopEventPropagation}
            >
              <Button
                className="incident-popup-action"
                style={{
                  background: `linear-gradient(135deg, ${pCfg.color}dd, ${pCfg.color}aa)`,
                  boxShadow: `0 4px 12px ${pCfg.glow}`
                }}
                onClick={handleViewDetail}
              >
                <ExternalLink size={13} />
                Ver Detalle
              </Button>
            </div>
          )}

          {
            incident.status !== 'RESUELTO' && incident.status === 'REPORTADO' && (
              <div className="incident-work-order-form">

                <Alert
                  type='info'
                  size='small'
                  className='heartbeat-alert'
                  dismissible={false}
                  message="El reporte no tiene una orden de trabajo, por favor asigne un técnico inspector"
                />
                <label htmlFor="employee-select">Técnico Inspector *</label>
                <SearchableSelect
                  value={technicianId}
                  onChange={v => setTechnicianId(String(v))}
                  options={employees}
                  placeholder={loadingEmployees ? 'Cargando técnicos...' : 'Buscar técnico...'}
                  disabled={loadingEmployees}
                  size="compact"
                />
                { /* Button for add work order from inciden selected*/}
                <Button
                  className="incident-popup-action"
                  onClick={handleCreateWorkOrder}
                  disabled={!canCreateOrder}
                >
                  <ExternalLink size={13} />
                  {loading ? 'Generando...' : 'Generar Orden de Trabajo'}
                </Button>
              </div>
            )
          }
          {
            incident.orderCode !== null && (
              <div className="incident-work-order-form">
                <Alert
                  type='success'
                  size='small'
                  dismissible={false}
                  message={`El incidente tiene una orden de trabajo: ${incident.orderCode}`}
                />
                {/* Button for add work order from inciden selected*/}
                <Button
                  className="incident-popup-action"
                  onClick={() => onViewOrder(incident.orderCode!)}
                  disabled={loading}
                  size='compact'
                >
                  <ExternalLink size={13} />
                  {loading ? 'Generando...' : 'Ver Orden de Trabajo'}
                </Button>
              </div>
            )
          }
        </div>

      </div>
    );
  }
);
