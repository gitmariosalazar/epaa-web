// ============================================================
// PRESENTATION — WorkOrderCreatePage (3-step wizard)
//
// CLEAN ARCHITECTURE:
//   - CreateWorkOrderUseCase encapsula toda la lógica de creación.
//   - Cada paso es un sub-componente con SRP propio.
//   - Los datos de cliente vienen de use cases de Customers.
//
// SOLID:
//   - SRP  : el page solo orquesta pasos y estado global.
//   - OCP  : agregar pasos no requiere cambiar este archivo.
//   - DIP  : depende de CreateWorkOrderUseCase (abstracción).
//   - ISP  : cada step recibe solo sus props necesarias.
// ============================================================
import React, { useCallback, useState } from 'react';
import { useNavigate }                  from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';

import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button }     from '@/shared/presentation/components/Button/Button';
import { Modal }      from '@/shared/presentation/components/Modal/Modal';
import { useAuth }    from '@/shared/presentation/context/AuthContext';

// ── Domain ────────────────────────────────────────────────────────────────────
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import { CreateWorkOrderUseCase }         from '../../application/usecases/CreateWorkOrderUseCase';

// ── Sub-components (SRP — each file owns one concern) ────────────────────────
import { StepIndicator }    from '@/modules/processes/solicitudes/presentation/pages/solicitud-nueva/StepIndicator';
import { ClienteStep }      from './work-order-new/ClienteStep';
import { OrdenDetalleStep } from './work-order-new/OrdenDetalleStep';
import { ConfirmacionStep } from './work-order-new/ConfirmacionStep';
import { WorkOrderSuccess } from './work-order-new/WorkOrderSuccess';

// ── Constants & helpers ───────────────────────────────────────────────────────
import { INITIAL_FORM, STEPS }   from './work-order-new/constants';
import { validateStep }           from './work-order-new/helpers';
import type { WorkOrderForm }     from './work-order-new/types';

// ── Styles ────────────────────────────────────────────────────────────────────
import '@/modules/processes/solicitudes/presentation/styles/SolicitudNuevaPage.css';
import '../styles/WorkOrderCreatePage.css';

// ─────────────────────────────────────────────────────────────────────────────
export const WorkOrderCreatePage: React.FC = () => {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const currentUserId = user?.userId ?? '';

  // ── DIP: inject repository through use case ──────────────────────────────
  const repo          = React.useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);
  const createUseCase = React.useMemo(() => new CreateWorkOrderUseCase(repo), [repo]);

  // ── Wizard state ─────────────────────────────────────────────────────────
  const [step,         setStep]         = useState(1);
  const [form,         setForm]         = useState<WorkOrderForm>(INITIAL_FORM);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [codigoOrden,  setCodigoOrden]  = useState<string | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFormChange = useCallback((fields: Partial<WorkOrderForm>) => {
    setForm(prev => ({ ...prev, ...fields }));
    setErrors({});
    setIsModalOpen(false);
  }, []);

  const handlePrevStep = useCallback(() => {
    setErrors({});
    setIsModalOpen(false);
    setStep(s => s - 1);
  }, []);

  // OCP: validation delegated to helpers.ts — page doesn't know the rules
  const handleNextStep = useCallback(() => {
    const result = validateStep(step, form);
    if (!result.valid) {
      setErrors(result.errors);
      setIsModalOpen(true);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  }, [step, form]);

  // DIP: page calls use case, doesn't know repository details
  const handleSubmit = async () => {
    const result = validateStep(step, form);
    if (!result.valid) {
      setErrors(result.errors);
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createUseCase.execute({
        origin:          form.origin,
        workTypeId:      form.workTypeId,
        priorityId:      form.priorityId,
        clientId:        form.clientId,
        cadastralKey:    form.cadastralKey || undefined,
        location:        form.location,
        description:     form.description || undefined,
        longitude:       form.longitude ? parseFloat(form.longitude) : undefined,
        latitude:        form.latitude  ? parseFloat(form.latitude)  : undefined,
        createdByUserId: currentUserId,
      });
      const code = (response as any)?.codigoOrden
                ?? (response as any)?.workOrderCode
                ?? null;
      setCodigoOrden(code);
      setSubmitted(true);
    } catch (e: any) {
      setErrors({ submit: e.message || 'Error al crear la orden de trabajo.' });
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = useCallback(() => {
    setSubmitted(false);
    setStep(1);
    setForm(INITIAL_FORM);
    setCodigoOrden(null);
    setErrors({});
  }, []);

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <PageLayout>
        <WorkOrderSuccess
          codigoOrden={codigoOrden}
          onCreateAnother={handleCreateAnother}
          onGoToProcess={() => navigate('/work-orders/process')}
        />
      </PageLayout>
    );
  }

  // ── Wizard ────────────────────────────────────────────────────────────────
  return (
    <PageLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            id="btn-wo-back"
          >
            Atrás
          </Button>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Nueva Orden de Trabajo
          </h2>
        </div>
      }
      footer={
        <div className="solicitud-nav-footer">
          <div className="solicitud-nav-footer-inner">
            {step > 1 && (
              <Button
                id="btn-wo-prev"
                variant="ghost"
                onClick={handlePrevStep}
                leftIcon={<ChevronLeft size={18} />}
              >
                Anterior
              </Button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length ? (
              <Button
                id="btn-wo-next"
                variant="primary"
                onClick={handleNextStep}
                rightIcon={<ChevronRight size={18} />}
              >
                Continuar
              </Button>
            ) : (
              <Button
                id="btn-wo-submit"
                variant="success"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                leftIcon={!isSubmitting ? <Check size={18} /> : undefined}
              >
                Crear Orden de Trabajo
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="solicitud-wizard-container">
        {/* Step indicator — reutilizado de Solicitudes */}
        <div className="solicitud-steps-sticky-container">
          <StepIndicator step={step} steps={STEPS} />
        </div>

        <div className="request-container">
          <div className="solicitud-step-content-wrapper">

            {/* Paso 1 — Buscar cliente */}
            {step === 1 && (
              <ClienteStep
                form={form}
                onFormChange={handleFormChange}
                errors={errors}
              />
            )}

            {/* Paso 2 — Detalle de la OT */}
            {step === 2 && (
              <OrdenDetalleStep
                form={form}
                onFormChange={handleFormChange}
                errors={errors}
              />
            )}

            {/* Paso 3 — Confirmación / resumen */}
            {step === 3 && (
              <ConfirmacionStep form={form} />
            )}

          </div>
        </div>
      </div>

      {/* Validation modal — mismo patrón que SolicitudNuevaPage */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Campos requeridos incompletos"
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
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Por favor completa la siguiente información obligatoria:
              </p>
            </div>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.values(errors).map((err, idx) => (
              <li key={idx} style={{ color: 'var(--text-main)' }}>{err}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </PageLayout>
  );
};
