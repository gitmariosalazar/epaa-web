/**
 * SignContractModal — Fase 11
 * SRP: gestiona el registro de firma del contrato.
 */
import React, { useState } from 'react';
import { SignContractUseCase } from '../../application/usecases/SignContractUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FileCheck, X, Clock, Link } from 'lucide-react';
import '../styles/ActionModal.css';

interface SignContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  solicitudNumero: string;
  userId: string;
  onSuccess: () => void;
}

const useCase = new SignContractUseCase(new SolicitudRepositoryImpl());

const FIRMA_OPTIONS: { value: 'FIRMADO_CLIENTE' | 'FIRMADO_EPAA' | 'COMPLETO'; label: string; desc: string }[] = [
  { value: 'FIRMADO_CLIENTE', label: 'Firmado por el Cliente',    desc: 'Solo el cliente firmó — EPAA pendiente' },
  { value: 'FIRMADO_EPAA',   label: 'Firmado por EPAA',          desc: 'Solo EPAA firmó — cliente pendiente' },
  { value: 'COMPLETO',       label: 'Completo — Ambas Partes',   desc: 'El contrato tiene las dos firmas requeridas' },
];

export const SignContractModal: React.FC<SignContractModalProps> = ({
  isOpen, onClose, contractId, solicitudNumero, userId, onSuccess
}) => {
  const [signatureStatus, setSignatureStatus] = useState<'FIRMADO_CLIENTE' | 'FIRMADO_EPAA' | 'COMPLETO'>('COMPLETO');
  const [signedContractUrl, setSignedContractUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedContractUrl.trim()) {
      MessageToastCustom('error', 'Campo requerido', 'Ingrese la URL del contrato firmado.');
      return;
    }
    if (!contractId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID del contrato. Recargue la página.');
      return;
    }
    setLoading(true);
    try {
      await useCase.execute({ contractId, signatureStatus, signedContractUrl: signedContractUrl.trim(), userId });
      MessageToastCustom(
        'success',
        signatureStatus === 'COMPLETO' ? '¡Contrato Firmado!' : 'Firma Registrada',
        signatureStatus === 'COMPLETO'
          ? 'El contrato fue firmado por ambas partes. Se procede a la instalación.'
          : 'La firma fue registrada. Falta la contraparte.'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo registrar la firma.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--green">
          <div className="action-modal__header-icon"><FileCheck size={20} /></div>
          <div>
            <h3 className="action-modal__title">Registrar Firma del Contrato</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 11</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__field">
            <label className="action-modal__label">Estado de Firma</label>
            <div className="action-modal__radio-group">
              {FIRMA_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`action-modal__radio${signatureStatus === opt.value ? ' action-modal__radio--selected' : ''}`}
                >
                  <input
                    type="radio" name="signatureStatus" value={opt.value}
                    checked={signatureStatus === opt.value}
                    onChange={() => setSignatureStatus(opt.value)}
                  />
                  <div>
                    <span className="action-modal__radio-title">{opt.label}</span>
                    <span className="action-modal__radio-desc">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label"><Link size={13} /> URL del Contrato Firmado *</label>
            <input
              type="url"
              className="action-modal__input"
              placeholder="https://storage.epaa.gob.ec/contratos/..."
              value={signedContractUrl}
              onChange={e => setSignedContractUrl(e.target.value)}
            />
            <span className="action-modal__hint">Ingrese la URL donde está almacenado el documento firmado.</span>
          </div>

          <div className="action-modal__actions">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : <FileCheck size={15} />}
            >
              {loading ? 'Registrando...' : 'Registrar Firma'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
