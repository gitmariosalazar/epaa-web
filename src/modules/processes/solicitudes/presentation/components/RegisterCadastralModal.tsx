/**
 * RegisterCadastralModal — Fase 14
 * SRP: gestiona el registro catastral y activación del suministro (estado final BPMN).
 */
import React, { useState, useEffect } from 'react';
import { RegisterCadastralUseCase } from '../../application/usecases/RegisterCadastralUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { ShieldCheck, X, Clock, Zap, Hash, MapPin, XCircle, FileText } from 'lucide-react';
import '../styles/ActionModal.css';
import './RegisterCadastralModal.css';
import { useWorkOrderRequestViewModel } from '../hooks/useWorkOrderRequestViewModel';
import { WorkOrderRequestProvider } from '../context/WorkOrderRequestProvider';
import { MdMessage } from 'react-icons/md';
import { Alert } from '@/shared/presentation/components/Alert';
import type { EvidenceAttachmentResponse, MaterialResponse, WorkerResponse, WorkOrderObservationResponse } from '../../domain/dto/WorkOrderReportResponse';
import WorkOrderDetails from './WorkOrderDetails';
import { GeoSection } from '@/shared/presentation/components/GeoLocation';

interface RegisterCadastralModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  contractId?: string;
  registratorId: string;
  /** Pre-fill from solicitud */
  defaultCadastralKey?: string;
  defaultAddress?: string;
  onSuccess: () => void;
}

const useCase = new RegisterCadastralUseCase(new SolicitudRepositoryImpl());

const RegisterCadastralModalInner: React.FC<RegisterCadastralModalProps> = ({
  isOpen, onClose, solicitudId, solicitudNumero, contractId, registratorId,
  defaultCadastralKey, defaultAddress, onSuccess
}) => {
  const [cadastralKey, setCadastralKey] = useState(defaultCadastralKey ?? '');
  const [meterNumber, setMeterNumber] = useState('');
  const [exactAddress, setExactAddress] = useState(defaultAddress ?? '');
  const [accountNumber, setAccountNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [connectionDiameter, setConnectionDiameter] = useState('');
  const [serviceType, setServiceType] = useState('AGUA_POTABLE');
  const [installationDate, setInstallationDate] = useState('');
  const [loading, setLoading] = useState(false);

  const { fetchInstallationReport, installationReport, loading: loadingReport, error } = useWorkOrderRequestViewModel();

  useEffect(() => {
    if (isOpen && solicitudNumero) {
      fetchInstallationReport(solicitudNumero);
    }
  }, [isOpen, solicitudNumero, fetchInstallationReport]);

  useEffect(() => {
    if (installationReport) {
      if (installationReport.meterNumber && !meterNumber) setMeterNumber(installationReport.meterNumber);
      if (installationReport.connectionDiameter && !connectionDiameter) setConnectionDiameter(installationReport.connectionDiameter);
      if (installationReport.location?.latitude && !latitude) setLatitude(installationReport.location.latitude.toString());
      if (installationReport.location?.longitude && !longitude) setLongitude(installationReport.location.longitude.toString());
      if (installationReport.installationDate && !installationDate) {
        setInstallationDate(installationReport.installationDate.split('T')[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installationReport]);

  const materialList: MaterialResponse[] = installationReport?.workOrder?.materials ?? [];
  const workersList: WorkerResponse[] = installationReport?.workOrder?.workers ?? [];
  const evidenceAttachmentsList: EvidenceAttachmentResponse[] = installationReport?.workOrder?.evidenceAttachments ?? [];
  const observationsList: WorkOrderObservationResponse[] = installationReport?.workOrder?.observations ?? [];


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: [string, string][] = [
      [cadastralKey, 'La clave catastral es requerida'],
      [meterNumber, 'El número de medidor es requerido'],
      [exactAddress, 'La dirección exacta es requerida'],
      [accountNumber, 'El número de cuenta es requerido'],
      [installationDate, 'La fecha de instalación es requerida'],
      [longitude || '1', 'La longitud es requerida'],
      [latitude || '1', 'La latitud es requerida'],
    ];
    for (const [val, msg] of required) {
      if (!val.trim()) {
        MessageToastCustom('error', 'Campo requerido', msg);
        return;
      }
    }

    setLoading(true);
    try {
      await useCase.execute({
        solicitudId,
        contractId: contractId || undefined,
        cadastralKey: cadastralKey.trim(),
        meterNumber: meterNumber.trim(),
        exactAddress: exactAddress.trim(),
        longitude: Number(longitude) || 0,
        latitude: Number(latitude) || 0,
        connectionDiameter: connectionDiameter.trim() || undefined,
        serviceType: serviceType || undefined,
        installationDate,
        accountNumber: accountNumber.trim(),
        registratorId
      });
      MessageToastCustom(
        'success',
        '¡Suministro Activado!',
        'El predio fue registrado en catastro y el suministro está activo. Proceso completado.'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo completar el registro catastral.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal action-modal--wide register-cadastral-modal" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--teal">
          <div className="action-modal__header-icon"><ShieldCheck size={20} /></div>
          <div>
            <h3 className="action-modal__title">Registro Catastral y Activación</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 14 — Estado Final</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__info-box action-modal__info-box--info">
            <Zap size={14} />
            <span>Esta es la fase final del proceso BPMN. Al completar, el suministro quedará ACTIVO y el cliente ingresará a cartera de facturación.</span>
          </div>

          <div className="register-cadastral-content">
            <div className="register-cadastral-subcontent register-cadastral-subcontent--left">
              {loadingReport ? (
                <div className="approve-modal__loading">
                  <Clock className="spin-icon" size={18} /> <span>Cargando datos del informe...</span>
                </div>
              ) : error ? (
                <div className="approve-modal__error">
                  <XCircle size={18} /> <span>{error}</span>
                </div>
              ) : installationReport ? (
                <div className="approve-modal__report-box installation-report">
                  <h4 className="approve-modal__report-title">
                    <FileText size={15} /> Detalles de la Instalación
                  </h4>
                  <div className="approve-modal__report-grid">
                    <div>
                      <strong className="approve-modal__report-label">ESTADO DE INSTALACIÓN</strong>
                      <span className={installationReport.result === 'FINALIZADA' || installationReport.result === 'COMPLETADO' || installationReport.result === 'EXITOSO' ? 'approve-modal__report-value--success' : 'approve-modal__report-value--info'}>
                        {installationReport.result}
                      </span>
                    </div>
                    {installationReport.installationDate && (
                      <div>
                        <strong className="approve-modal__report-label">FECHA DE EJECUCIÓN</strong>
                        <span className="approve-modal__report-value">{new Date(installationReport.installationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {installationReport.meterNumber && (
                      <div>
                        <strong className="approve-modal__report-label">N° DE MEDIDOR INSTALADO</strong>
                        <span className="approve-modal__report-value">{installationReport.meterNumber}</span>
                      </div>
                    )}
                    {installationReport.initialReading != null && (
                      <div>
                        <strong className="approve-modal__report-label">LECTURA INICIAL</strong>
                        <span className="approve-modal__report-value">{installationReport.initialReading} m³</span>
                      </div>
                    )}
                    {installationReport.securitySeal && (
                      <div>
                        <strong className="approve-modal__report-label">SELLO DE SEGURIDAD</strong>
                        <span className="approve-modal__report-value">{installationReport.securitySeal}</span>
                      </div>
                    )}
                    {installationReport.connectionDiameter && (
                      <div>
                        <strong className="approve-modal__report-label">DIÁMETRO ACOMETIDA</strong>
                        <span className="approve-modal__report-value">{installationReport.connectionDiameter}</span>
                      </div>
                    )}
                    {installationReport.finalConditions && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong className="approve-modal__report-label">CONDICIONES FINALES</strong>
                        <span className="approve-modal__report-value">{installationReport.finalConditions}</span>
                      </div>
                    )}
                  </div>
                  {installationReport.observations && (
                    <div className="approve-modal__report-observations">
                      <strong className="approve-modal__report-label">OBSERVACIONES DEL TÉCNICO</strong>
                      <Alert icon={<MdMessage size={12} />} type='info' dismissible={false} size='xsmall' message={installationReport.observations} />
                    </div>
                  )}

                  {installationReport.location?.latitude != null && installationReport.location?.longitude != null && (
                    <div className="approve-modal__report-location-map-wrapper">
                      <GeoSection lat={Number(installationReport.location.latitude)} lng={Number(installationReport.location.longitude)} />
                    </div>
                  )}


                  <WorkOrderDetails className='work-order-details-installation'
                    materialList={materialList}
                    workersList={workersList}
                    evidenceAttachmentsList={evidenceAttachmentsList}
                    observationsList={observationsList}
                  />
                </div>
              ) : null}
            </div>
            <div className="register-cadastral-subcontent">
              <div className="action-modal__section-title">Datos del Predio</div>
              <div className="action-modal__row">
                <div className="action-modal__field">
                  <label className="action-modal__label"><Hash size={13} /> Clave Catastral *</label>
                  <input type="text" className="action-modal__input"
                    placeholder="Ej: 01-03-045-001-000-000" value={cadastralKey}
                    onChange={e => setCadastralKey(e.target.value)} />
                </div>
                <div className="action-modal__field">
                  <label className="action-modal__label">Tipo de Servicio</label>
                  <select className="action-modal__select" value={serviceType} onChange={e => setServiceType(e.target.value)}>
                    <option value="AGUA_POTABLE">Agua Potable</option>
                    <option value="ALCANTARILLADO">Alcantarillado</option>
                    <option value="MIXTO">Mixto (Agua + Alcantarillado)</option>
                  </select>
                </div>
              </div>

              <div className="action-modal__field">
                <label className="action-modal__label"><MapPin size={13} /> Dirección Exacta *</label>
                <input type="text" className="action-modal__input"
                  placeholder="Calle, número, barrio, referencia..." value={exactAddress}
                  onChange={e => setExactAddress(e.target.value)} />
              </div>

              <div className="action-modal__row">
                <div className="action-modal__field">
                  <label className="action-modal__label">Longitud</label>
                  <input type="number" step="any" className="action-modal__input"
                    placeholder="-78.12345" value={longitude}
                    onChange={e => setLongitude(e.target.value)} />
                </div>
                <div className="action-modal__field">
                  <label className="action-modal__label">Latitud</label>
                  <input type="number" step="any" className="action-modal__input"
                    placeholder="-0.98765" value={latitude}
                    onChange={e => setLatitude(e.target.value)} />
                </div>
              </div>

              <div className="action-modal__section-title">Datos del Medidor y Cuenta</div>
              <div className="action-modal__row">
                <div className="action-modal__field">
                  <label className="action-modal__label"><Hash size={13} /> N° de Medidor *</label>
                  <input type="text" className="action-modal__input"
                    placeholder="Ej: MED-2026-00451" value={meterNumber}
                    onChange={e => setMeterNumber(e.target.value)} />
                </div>
                <div className="action-modal__field">
                  <label className="action-modal__label"><Hash size={13} /> N° de Cuenta (Facturación) *</label>
                  <input type="text" className="action-modal__input"
                    placeholder="Ej: CTA-2026-00451" value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)} />
                </div>
              </div>

              <div className="action-modal__row">
                <div className="action-modal__field">
                  <label className="action-modal__label">Diámetro de Conexión</label>
                  <input type="text" className="action-modal__input"
                    placeholder='Ej: 1/2"' value={connectionDiameter}
                    onChange={e => setConnectionDiameter(e.target.value)} />
                </div>
                <div className="action-modal__field">
                  <label className="action-modal__label">Fecha de Instalación *</label>
                  <DatePicker
                    value={installationDate}
                    onChange={setInstallationDate}
                    size="medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="action-modal__actions">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : <Zap size={15} />}
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderColor: '#10b981' }}
            >
              {loading ? 'Activando...' : '✓ Registrar y Activar Suministro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RegisterCadastralModal: React.FC<RegisterCadastralModalProps> = (props) => {
  return (
    <WorkOrderRequestProvider>
      <RegisterCadastralModalInner {...props} />
    </WorkOrderRequestProvider>
  );
};
