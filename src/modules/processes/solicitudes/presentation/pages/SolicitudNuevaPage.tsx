// ============================================================
// PRESENTATION — SolicitudNuevaPage (5-step wizard)
//
// CLEAN ARCHITECTURE:
//   - tramiteId comes from URL (:tramiteId param) — each tramite
//     is an independent process with its own requisitos.
//   - GetTramiteByIdUseCase loads the exact requirements.
//   - DocumentUploadCard handles per-document upload (SRP).
//   - ValidateDocumentoUseCase enforces business rules.
//   - DocumentosMap state owned here as orchestrator (SRP).
//
// SOLID:
//   - SRP: wizard orchestrates steps, doesn't know upload logic.
//   - OCP: add new tramites by adding to TramitesCatalog, not here.
//   - DIP: depends on Tramite domain type, not on implementations.
// ============================================================

import React, { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  Droplets,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { useTramiteById } from '@/modules/tramites/presentation/context/TramitesContext';
import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import './SolicitudNuevaPage.css';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import { DocumentsStep } from './solicitud-nueva/DocumentsStep';
import { PersonalDataStep } from './solicitud-nueva/PersonalDataStep';
import { SolicitudSuccess } from './solicitud-nueva/SolicitudSuccess';
import { StepIndicator } from './solicitud-nueva/StepIndicator';
import { SummaryStep } from './solicitud-nueva/SummaryStep';
import { DEFAULT_TRAMITE_ID, INITIAL_FORM, STEPS } from './solicitud-nueva/constants';
import { buildSolicitudFormData } from './solicitud-nueva/helpers';
import type { SolicitudForm } from './solicitud-nueva/types';
import { useSolicitudFormSetup } from './solicitud-nueva/useSolicitudFormSetup';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ValidateSolicitudStepUseCase } from '../../application/usecases/ValidateSolicitudStepUseCase';

// ── Main page ────────────────────────────────────────────────
export const SolicitudNuevaPage: React.FC = () => {
  // OCP: tramiteId from URL — new tramite types need zero changes here
  const { tramiteId = DEFAULT_TRAMITE_ID } = useParams<{
    tramiteId?: string;
  }>();
  const navigate = useNavigate();

  const { tramite, isLoading: tramiteLoading } = useTramiteById(tramiteId);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SolicitudForm>(INITIAL_FORM);
  const [documentos, setDocumentos] = useState<DocumentosMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSolicitudId, setCreatedSolicitudId] = useState<string | null>(
    null
  );

  const validateStepUseCase = React.useMemo(() => new ValidateSolicitudStepUseCase(), []);

  const { user: authUser } = useAuth();
  useSolicitudFormSetup(form, setForm, authUser, tramite);

  const handlePrevStep = useCallback(() => {
    setErrors({});
    setIsModalOpen(false);
    setStep((s) => s - 1);
  }, []);

  const handleNextStep = useCallback(() => {
    const res = validateStepUseCase.execute(step, form, tramite, documentos);
    if (!res.valid) {
      setErrors(res.errors);
      setIsModalOpen(true);
      return;
    }
    setErrors({});
    setIsModalOpen(false);
    setStep((s) => s + 1);
  }, [step, form, tramite, documentos, validateStepUseCase]);

  // DIP: handlers only use DocumentoAdjunto domain type
  const handleAttach = useCallback((requisitoId: string, file: File) => {
    setDocumentos((prev) => ({
      ...prev,
      [requisitoId]: { requisitoId, file, estado: 'pendiente' }
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[requisitoId];
      return copy;
    });
    setIsModalOpen(false);
  }, []);

  const handleRemove = useCallback((requisitoId: string) => {
    setDocumentos((prev) => {
      const n = { ...prev };
      delete n[requisitoId];
      return n;
    });
    setIsModalOpen(false);
  }, []);

  const handleSubmit = async () => {
    if (!tramite) return;
    setIsSubmitting(true);
    try {
      const formData = buildSolicitudFormData({
        form,
        tramite,
        userId: authUser?.userId,
        documentos
      });

      // Send the request using apiClient
      const response = await apiClient.post<any>(
        '/requests/submit-with-documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // response.data contains the ApiResponse structure from client-gateway
      const apiResponse = response.data as any;
      if (apiResponse && apiResponse.data) {
        const solicitudId = apiResponse.data.solicitudId;
        setCreatedSolicitudId(solicitudId);
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error al enviar la solicitud:', error);
      alert(error.message || 'Error al enviar la solicitud. Intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const docsSubidos = Object.keys(documentos).length;
  const docsTotal =
    tramite?.requisitos.filter((r) => r.obligatorio).length ?? 0;
  const allDocsReady = docsSubidos >= docsTotal;

  // ── Loading state ──
  if (tramiteLoading) {
    return (
      <PageLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            gap: '0.75rem'
          }}
        >
          <Droplets size={24} />
          <span>Cargando proceso...</span>
        </div>
      </PageLayout>
    );
  }

  if (submitted) {
    return (
      <SolicitudSuccess
        tramite={tramite}
        docsSubidos={docsSubidos}
        createdSolicitudId={createdSolicitudId}
        onGoToTramites={() => navigate('/tramites')}
        onCreateAnother={() => {
          setSubmitted(false);
          setStep(1);
          setForm(INITIAL_FORM);
          setDocumentos({});
          setCreatedSolicitudId(null);
        }}
      />
    );
  }

  return (
    <PageLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            id="btn-back-wizard"
          >
            Atrás
          </Button>
          <h2
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}
          >
            Nueva Solicitud — {tramite?.nombre ?? 'Acometida'}
          </h2>
        </div>
      }
    >
      <div className="solicitud-wizard-container">
        <div className="solicitud-steps-sticky-container">
          <StepIndicator step={step} steps={STEPS} />
        </div>

        <div className="request-container">
          {step === 1 && (
            <PersonalDataStep
              form={form}
              tramite={tramite}
              onDetallesChange={(newDetalles) => {
                setForm((prev) => ({ ...prev, detalles: newDetalles }));
                setErrors({});
                setIsModalOpen(false);
              }}
              onFormChange={(updatedFields) => {
                setForm((prev) => ({ ...prev, ...updatedFields }));
                setErrors({});
                setIsModalOpen(false);
              }}
              errors={errors}
            />
          )}

          {step === 2 && tramite && (
            <DocumentsStep
              tramite={tramite}
              documentos={documentos}
              onAttach={handleAttach}
              onRemove={handleRemove}
            />
          )}

          {step === 3 && (
            <SummaryStep
              form={form}
              tramite={tramite ?? undefined}
              documentos={documentos}
              allDocsReady={allDocsReady}
              docsSubidos={docsSubidos}
              docsTotal={docsTotal}
            />
          )}

          {/* ── Navigation ── */}
          <div className="solicitud-nav">
            {step > 1 && (
              <Button
                id="btn-prev-step"
                variant="ghost"
                onClick={handlePrevStep}
                leftIcon={<ChevronLeft size={18} />}
              >
                Anterior
              </Button>
            )}
            <div style={{ flex: 1 }} />
            {step < 3 ? (
              <Button
                id="btn-next-step"
                variant="primary"
                onClick={handleNextStep}
                rightIcon={<ChevronRight size={18} />}
              >
                Continuar
              </Button>
            ) : (
              <Button
                id="btn-submit-solicitud"
                variant="success"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                leftIcon={!isSubmitting ? <Check size={18} /> : undefined}
              >
                Enviar Solicitud
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Campos Requeridos Incompletos"
        size="sm"
        footer={
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Entendido
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--error)' }}>
            <AlertTriangle size={32} style={{ flexShrink: 0, color: 'var(--error)' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                No se puede avanzar al siguiente paso
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Por favor complete la siguiente información obligatoria:
              </p>
            </div>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.values(errors).map((err, idx) => (
              <li key={idx} style={{ color: 'var(--text-main)' }}>
                {err}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </PageLayout>
  );
};
