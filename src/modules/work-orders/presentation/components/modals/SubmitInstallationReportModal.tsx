import React, { useState, useCallback } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Hash,
  Zap,
  CheckSquare,
} from 'lucide-react';
import { WoModalShell } from './WoModalShell';
import type { SubmitInstallationReportCommand } from '../../../domain/schemas/dto/commands/submit-installation-report.command';

import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { Button } from '@/shared/presentation/components/Button/Button';
import { GeoLocationDisplay, useGeolocation } from '@/shared/presentation/components/GeoLocation';

type InstallationResult = 'EXITOSO' | 'FALLIDA';

interface SubmitInstallationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  orderCode: string;
  onSubmit: (cmd: SubmitInstallationReportCommand) => Promise<void>;
  isLoading?: boolean;
}

interface ResultOptionProps {
  value: InstallationResult;
  selected: InstallationResult;
  onChange: (v: InstallationResult) => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const ResultOption: React.FC<ResultOptionProps> = ({
  value,
  selected,
  onChange,
  icon,
  label,
  description,
  color,
}) => {
  const isSelected = value === selected;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '2px solid',
        borderColor: isSelected ? color : 'var(--border-color)',
        backgroundColor: isSelected ? 'var(--surface-color)' : 'var(--surface-hover)',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'none',
        boxShadow: isSelected ? `0 0 0 1px ${color}` : 'none',
        opacity: isSelected ? 1 : 0.7,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          color: isSelected ? color : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
      <div>
        <h4
          style={{
            margin: '0 0 0.2rem 0',
            fontWeight: '700',
            fontSize: '1rem',
            color: isSelected ? color : 'var(--text-secondary)'
          }}
        >
          {label}
        </h4>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          {description}
        </p>
      </div>
    </button>
  );
};

export const SubmitInstallationReportModal: React.FC<SubmitInstallationReportModalProps> = ({
  isOpen,
  onClose,
  workOrderId,
  orderCode,
  onSubmit,
  isLoading = false,
}) => {
  const [result, setResult] = useState<InstallationResult>('EXITOSO');
  const [meterNumber, setMeterNumber] = useState('');
  const [initialReading, setInitialReading] = useState<string>('');
  const [securitySeal, setSecuritySeal] = useState('');
  const [connectionDiameter, setConnectionDiameter] = useState('');
  const [finalConditions, setFinalConditions] = useState('');
  const [observations, setObservations] = useState('');
  
  // Geolocation hook
  const geo = useGeolocation();

  const resetForm = useCallback(() => {
    setResult('EXITOSO');
    setMeterNumber('');
    setInitialReading('');
    setSecuritySeal('');
    setConnectionDiameter('');
    setFinalConditions('');
    setObservations('');
    geo.clear();
  }, [geo]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      let geomMeter: string | undefined = undefined;
      if (geo.address && geo.address.longitude && geo.address.latitude) {
        geomMeter = `POINT(${geo.address.longitude} ${geo.address.latitude})`;
      }

      const command: SubmitInstallationReportCommand = {
        workOrderId,
        result,
        meterNumber: meterNumber || undefined,
        initialReading: initialReading === '' ? undefined : Number(initialReading),
        securitySeal: securitySeal || undefined,
        connectionDiameter: connectionDiameter || undefined,
        geomMeter,
        finalConditions: finalConditions || undefined,
        observations: observations || undefined,
      };

      await onSubmit(command);
      resetForm();
    },
    [
      workOrderId,
      result,
      meterNumber,
      initialReading,
      securitySeal,
      connectionDiameter,
      geo.address,
      finalConditions,
      observations,
      onSubmit,
      resetForm,
    ]
  );

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Informe de Instalación"
      subtitle={`Orden de Trabajo: ${orderCode}`}
      maxWidth="800px"
    >
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-color)', padding: 0, margin: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '650px' }}>
          
          {/* Resultado de la instalación */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', paddingBottom: '0.5rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)' }}>
              <Zap style={{ width: '20px', height: '20px', color: '#6366f1' }} />
              <h3 style={{ margin: 0 }}>Resultado de la Instalación</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <ResultOption
                value="EXITOSO"
                selected={result}
                onChange={setResult}
                icon={<CheckCircle2 style={{ width: '24px', height: '24px' }} />}
                label="Exitosa"
                description="La instalación se realizó correctamente y el medidor está operativo."
                color="#10b981" // emerald-500
              />
              <ResultOption
                value="FALLIDA"
                selected={result}
                onChange={setResult}
                icon={<XCircle style={{ width: '24px', height: '24px' }} />}
                label="Fallida"
                description="No fue posible completar la instalación. Requiere revisión técnica adicional."
                color="#f43f5e" // rose-500
              />
            </div>
          </section>

          {/* Datos del Medidor (Solo si fue exitoso) */}
          {result === 'EXITOSO' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', paddingBottom: '0.5rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)' }}>
                <Hash style={{ width: '20px', height: '20px', color: '#10b981' }} />
                <h3 style={{ margin: 0 }}>Datos del Medidor y Conexión</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input
                  label="Número de Medidor"
                  type="text"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="Ej. MED-2023-0891"
                  required
                />

                <Input
                  label="Lectura Inicial (m³)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialReading}
                  onChange={(e) => setInitialReading(e.target.value)}
                  placeholder="0.00"
                  required
                />

                <Input
                  label="Sello de Seguridad"
                  type="text"
                  value={securitySeal}
                  onChange={(e) => setSecuritySeal(e.target.value)}
                  placeholder="Código o serie del sello"
                  required
                />

                <Select
                  label="Diámetro de Conexión"
                  value={connectionDiameter}
                  onChange={(e) => setConnectionDiameter(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccionar diámetro...</option>
                  <option value="1/2">1/2"</option>
                  <option value="3/4">3/4"</option>
                  <option value="1">1"</option>
                  <option value="1 1/2">1 1/2"</option>
                  <option value="2">2"</option>
                </Select>
              </div>
            </section>
          )}

          {/* Condiciones y Observaciones */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', paddingBottom: '0.5rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)' }}>
              <CheckSquare style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <h3 style={{ margin: 0 }}>Condiciones y Observaciones</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-color)' }}>Ubicación GPS de la Instalación</label>
                <div style={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1rem' }}>
                  <GeoLocationDisplay
                    address={geo.address}
                    isLocating={geo.isLocating}
                    isGeocoding={geo.isGeocoding}
                    error={geo.error}
                    onGetLocation={geo.getLocation}
                    onClear={geo.clear}
                    hideAddressCard={false}
                  />
                </div>
              </div>

              {result === 'EXITOSO' && (
                <TextArea
                  label="Condiciones Finales"
                  value={finalConditions}
                  onChange={(e) => setFinalConditions(e.target.value)}
                  placeholder="Describa el estado en que quedó el área de instalación..."
                  rows={2}
                  required
                />
              )}

              <TextArea
                label={result === 'FALLIDA' ? 'Motivo de Falla / Observaciones' : 'Observaciones adicionales'}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder={
                  result === 'FALLIDA'
                    ? 'Describa detalladamente por qué no se pudo realizar la instalación...'
                    : 'Cualquier nota adicional o comentario...'
                }
                rows={result === 'FALLIDA' ? 4 : 2}
                required={result === 'FALLIDA'}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            leftIcon={!isLoading ? <ClipboardCheck style={{ width: '20px', height: '20px' }} /> : undefined}
          >
            {isLoading ? 'Enviando...' : 'Enviar Informe Técnico'}
          </Button>
        </div>
      </form>
    </WoModalShell>
  );
};
