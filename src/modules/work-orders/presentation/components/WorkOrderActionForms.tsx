/**
 * WorkOrderActionForms
 *
 * SRP: one form component per work-order action.
 * OCP: adding a field = extend the matching form component only.
 * No JSON, no raw textareas — all inputs are typed and labeled.
 */
import React from 'react';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import type { WorkOrderActionForms } from '../hooks/useWorkOrderActionForm';

// ── Shared field wrapper ─────────────────────────────────────────────────────

const F = ({
  label,
  required,
  children,
  hint
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="wof__field">
    <label className="wof__label">
      {label}
      {required && <span className="wof__required"> *</span>}
    </label>
    {children}
    {hint && <span className="wof__hint">{hint}</span>}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="wof__row">{children}</div>
);

// ── Shared BoolToggle (Aprobado / Rechazado) ─────────────────────────────────

const BoolToggle = ({
  label,
  trueLabel,
  falseLabel,
  value,
  onChange
}: {
  label: string;
  trueLabel: string;
  falseLabel: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <F label={label}>
    <div className="wof__toggle-group">
      <button
        type="button"
        className={`wof__toggle-btn wof__toggle-btn--success${value ? ' wof__toggle-btn--active' : ''}`}
        onClick={() => onChange(true)}
      >
        <CheckCircle2 size={15} />
        {trueLabel}
      </button>
      <button
        type="button"
        className={`wof__toggle-btn wof__toggle-btn--error${!value ? ' wof__toggle-btn--active' : ''}`}
        onClick={() => onChange(false)}
      >
        <XCircle size={15} />
        {falseLabel}
      </button>
    </div>
  </F>
);

// ── Phase-color header ────────────────────────────────────────────────────────

const PhaseHeader = ({
  phase,
  step,
  title,
  colorClass
}: {
  phase: string;
  step: string;
  title: string;
  colorClass: string;
}) => (
  <div className={`wof__phase-header wof__phase-header--${colorClass}`}>
    <span className="wof__phase-badge">{phase}</span>
    <span className="wof__phase-step">{step}</span>
    <span className="wof__phase-title">{title}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 1 — Crear OT
// ─────────────────────────────────────────────────────────────────────────────

export const CreateWorkOrderFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['createWorkOrder'];
  onChange: <K extends keyof WorkOrderActionForms['createWorkOrder']>(
    field: K,
    value: WorkOrderActionForms['createWorkOrder'][K]
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 1"
      step="Paso 1"
      title="Registrar nueva Orden de Trabajo"
      colorClass="blue"
    />

    <Row>
      <F label="Origen" required>
        <select
          className="wof__select"
          value={form.origin}
          onChange={(e) => onChange('origin', e.target.value)}
        >
          <option value="TRAMITE">Trámite</option>
          <option value="EMERGENCIA">Emergencia</option>
          <option value="MANTENIMIENTO">Mantenimiento</option>
          <option value="SUPERVISION">Supervisión</option>
        </select>
      </F>
      <F label="Prioridad" required>
        <select
          className="wof__select"
          value={form.priorityId}
          onChange={(e) => onChange('priorityId', e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          <option value="1">Alta</option>
          <option value="2">Media</option>
          <option value="3">Baja</option>
        </select>
      </F>
    </Row>

    <Row>
      <F label="Tipo de trabajo (ID)" required>
        <input
          className="wof__input"
          type="number"
          min="1"
          placeholder="Ej: 1"
          value={form.workTypeId}
          onChange={(e) => onChange('workTypeId', e.target.value)}
        />
      </F>
      <F label="Cliente ID" required>
        <input
          className="wof__input"
          type="text"
          placeholder="UUID del cliente"
          value={form.clientId}
          onChange={(e) => onChange('clientId', e.target.value)}
        />
      </F>
    </Row>

    <F label="Clave catastral">
      <input
        className="wof__input"
        type="text"
        placeholder="Ej: 0101010101"
        value={form.cadastralKey}
        onChange={(e) => onChange('cadastralKey', e.target.value)}
      />
    </F>

    <F label="Dirección / Ubicación" required>
      <input
        className="wof__input"
        type="text"
        placeholder="Sector, calle, referencia..."
        value={form.location}
        onChange={(e) => onChange('location', e.target.value)}
      />
    </F>

    <Row>
      <F label="Longitud">
        <input
          className="wof__input"
          type="number"
          step="any"
          placeholder="-78.5"
          value={form.longitude}
          onChange={(e) => onChange('longitude', e.target.value)}
        />
      </F>
      <F label="Latitud">
        <input
          className="wof__input"
          type="number"
          step="any"
          placeholder="-0.22"
          value={form.latitude}
          onChange={(e) => onChange('latitude', e.target.value)}
        />
      </F>
    </Row>

    <F label="Descripción">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Detalle de la falla o trabajo a realizar..."
        value={form.description}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </F>

    <F label="Creado por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 — Recibir OT
// ─────────────────────────────────────────────────────────────────────────────

const TransitionFormBase = ({
  form,
  onChange,
  phase,
  step,
  title,
  colorClass,
  commentPlaceholder
}: {
  form: { workOrderId: string; userId: string; comment: string };
  onChange: (field: string, value: string) => void;
  phase: string;
  step: string;
  title: string;
  colorClass: string;
  commentPlaceholder: string;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase={phase}
      step={step}
      title={title}
      colorClass={colorClass}
    />
    <F label="Número de Orden / ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID o código OT-..."
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Usuario ID" required>
      <input
        className="wof__input"
        type="text"
        value={form.userId}
        onChange={(e) => onChange('userId', e.target.value)}
      />
    </F>
    <F label="Comentario">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder={commentPlaceholder}
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

export const ReceiveWorkOrderFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['receiveWorkOrder'];
  onChange: (field: string, value: string) => void;
}) => (
  <TransitionFormBase
    form={form}
    onChange={onChange}
    phase="Fase 2"
    step="Paso 1"
    title="Recibir Orden de Trabajo"
    colorClass="indigo"
    commentPlaceholder="OT recibida para gestión administrativa..."
  />
);

export const StartPreparationFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['startPreparation'];
  onChange: (field: string, value: string) => void;
}) => (
  <TransitionFormBase
    form={form}
    onChange={onChange}
    phase="Fase 3"
    step="Paso 1"
    title="Iniciar Preparación y Seguridad"
    colorClass="amber"
    commentPlaceholder="Inicio de checklist y alistamiento de equipo..."
  />
);

export const StartExecutionFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['startExecution'];
  onChange: (field: string, value: string) => void;
}) => (
  <TransitionFormBase
    form={form}
    onChange={onChange}
    phase="Fase 4"
    step="Inicio"
    title="Iniciar Ejecución en Campo"
    colorClass="orange"
    commentPlaceholder="Inicio de trabajos en campo..."
  />
);

export const CompleteWorkOrderFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['completeWorkOrder'];
  onChange: (field: string, value: string) => void;
}) => (
  <TransitionFormBase
    form={form}
    onChange={onChange}
    phase="Fase 6"
    step="Paso 1"
    title="Completar y Cerrar Orden de Trabajo"
    colorClass="green"
    commentPlaceholder="Cierre administrativo del proceso..."
  />
);


// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 — Asignar a técnico
// ─────────────────────────────────────────────────────────────────────────────

export const AssignWorkerFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['assignWorkOrderToWorker'];
  onChange: (field: string, value: string) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 2"
      step="Paso 2 — Opción B"
      title="Asignar a Técnico Individual"
      colorClass="indigo"
    />
    <F label="Número de Orden / ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID o código OT-..."
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Técnico Worker ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID del técnico"
        value={form.workerId}
        onChange={(e) => onChange('workerId', e.target.value)}
      />
    </F>
    <F label="Asignado por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.assignedByUserId}
        onChange={(e) => onChange('assignedByUserId', e.target.value)}
      />
    </F>
    <F label="Comentario">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Instrucciones de asignación..."
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3 — Crear inspección de preparación
// ─────────────────────────────────────────────────────────────────────────────

export const CreateInspectionFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['createPreparationInspection'];
  onChange: (
    field: keyof WorkOrderActionForms['createPreparationInspection'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 3"
      step="Paso 2"
      title="Crear Inspección de Preparación (Checklist)"
      colorClass="amber"
    />
    <F label="Número de Orden / ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID o código OT-..."
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Creado por (userId)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>

    <BoolToggle
      label="¿Pasa revisión inicial?"
      trueLabel="Pasa"
      falseLabel="No pasa"
      value={form.passed}
      onChange={(v) => onChange('passed', v)}
    />
    <F label="Observaciones">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Observaciones del checklist..."
        value={form.observations}
        onChange={(e) => onChange('observations', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3 — Detalle de inspección
// ─────────────────────────────────────────────────────────────────────────────

export const AddInspectionDetailFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['addPreparationInspectionDetail'];
  onChange: (
    field: keyof WorkOrderActionForms['addPreparationInspectionDetail'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 3"
      step="Paso 2"
      title="Agregar Detalle de Inspección"
      colorClass="amber"
    />
    <Row>
      <F label="OT ID" required>
        <input
          className="wof__input"
          type="text"
          placeholder="UUID OT"
          value={form.workOrderId}
          onChange={(e) => onChange('workOrderId', e.target.value)}
        />
      </F>
      <F label="Inspección ID" required>
        <input
          className="wof__input"
          type="text"
          placeholder="UUID inspección"
          value={form.inspectionId}
          onChange={(e) => onChange('inspectionId', e.target.value)}
        />
      </F>
    </Row>
    <Row>
      <F label="Código del ítem" required hint="Ej: EPP-01, HERR-03">
        <input
          className="wof__input"
          type="text"
          placeholder="EPP-01"
          value={form.code}
          onChange={(e) => onChange('code', e.target.value)}
        />
      </F>
      <F label="Creado por (User ID)" required>
        <input
          className="wof__input"
          type="text"
          value={form.createdByUserId}
          onChange={(e) => onChange('createdByUserId', e.target.value)}
        />
      </F>
    </Row>
    <BoolToggle
      label="¿El ítem pasa el checklist?"
      trueLabel="Pasa"
      falseLabel="No pasa"
      value={form.passed}
      onChange={(v) => onChange('passed', v)}
    />
    <F label="Comentario">
      <textarea
        className="wof__textarea"
        rows={2}
        placeholder="Observación del ítem..."
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3 — Resolver inspección (gateway)
// ─────────────────────────────────────────────────────────────────────────────

export const ResolveInspectionFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['resolvePreparationInspection'];
  onChange: (
    field: keyof WorkOrderActionForms['resolvePreparationInspection'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 3"
      step="Gateway"
      title="Resolver Inspección de Preparación"
      colorClass="amber"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Usuario ID" required>
      <input
        className="wof__input"
        type="text"
        value={form.userId}
        onChange={(e) => onChange('userId', e.target.value)}
      />
    </F>
    <BoolToggle
      label="¿Pasa la inspección?"
      trueLabel="Aprobada → EN_PROCESO"
      falseLabel="Rechazada → REVISION_RECHAZADA"
      value={form.passed}
      onChange={(v) => onChange('passed', v)}
    />
    <F label="Comentario de resolución">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Justificación del resultado de la inspección..."
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4 — Agregar material
// ─────────────────────────────────────────────────────────────────────────────

export const AddMaterialFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['addWorkOrderMaterial'];
  onChange: (field: string, value: string) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 4"
      step="Paso 1"
      title="Registrar Material Utilizado"
      colorClass="orange"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <Row>
      <F label="Material ID" required hint="ID numérico del catálogo">
        <input
          className="wof__input"
          type="number"
          min="1"
          placeholder="1"
          value={form.materialId}
          onChange={(e) => onChange('materialId', e.target.value)}
        />
      </F>
      <F label="Creado por (User ID)" required>
        <input
          className="wof__input"
          type="text"
          value={form.createdByUserId}
          onChange={(e) => onChange('createdByUserId', e.target.value)}
        />
      </F>
    </Row>
    <Row>
      <F label="Cantidad" required>
        <input
          className="wof__input"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          value={form.quantity}
          onChange={(e) => onChange('quantity', e.target.value)}
        />
      </F>
      <F label="Costo unitario (USD)" required>
        <input
          className="wof__input"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.unitCost}
          onChange={(e) => onChange('unitCost', e.target.value)}
        />
      </F>
    </Row>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4 — Costo adicional
// ─────────────────────────────────────────────────────────────────────────────

export const AddAdditionalCostFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['addAdditionalCost'];
  onChange: (field: string, value: string) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 4"
      step="Paso 2"
      title="Registrar Costo Adicional"
      colorClass="orange"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Concepto" required>
      <input
        className="wof__input"
        type="text"
        placeholder="Ej: Horas extra, maquinaria, traslado..."
        value={form.concept}
        onChange={(e) => onChange('concept', e.target.value)}
      />
    </F>
    <Row>
      <F label="Cantidad" required>
        <input
          className="wof__input"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          value={form.quantity}
          onChange={(e) => onChange('quantity', e.target.value)}
        />
      </F>
      <F label="Costo unitario (USD)" required>
        <input
          className="wof__input"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.unitCost}
          onChange={(e) => onChange('unitCost', e.target.value)}
        />
      </F>
    </Row>
    <F label="Creado por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4 — Agregar adjunto
// ─────────────────────────────────────────────────────────────────────────────

export const AddAttachmentFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['addWorkOrderAttachment'];
  onChange: (field: string, value: string) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 4"
      step="Paso 3"
      title="Agregar Evidencia / Adjunto"
      colorClass="orange"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <Row>
      <F label="Nombre del archivo" required>
        <input
          className="wof__input"
          type="text"
          placeholder="evidencia.jpg"
          value={form.fileName}
          onChange={(e) => onChange('fileName', e.target.value)}
        />
      </F>
      <F label="Tipo de adjunto" required>
        <select
          className="wof__select"
          value={form.fileType}
          onChange={(e) => onChange('fileType', e.target.value)}
        >
          <option value="FOTO">Foto</option>
          <option value="VIDEO">Video</option>
          <option value="DOCUMENTO">Documento</option>
          <option value="PLANO">Plano</option>
          <option value="OTRO">Otro</option>
        </select>
      </F>
    </Row>
    <F
      label="URL del archivo"
      required
      hint="URL donde está almacenado el archivo"
    >
      <input
        className="wof__input"
        type="url"
        placeholder="https://storage.epaa.gob.ec/..."
        value={form.fileUrl}
        onChange={(e) => onChange('fileUrl', e.target.value)}
      />
    </F>
    <F label="Subido por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 5 — Crear control de calidad
// ─────────────────────────────────────────────────────────────────────────────

export const CreateQualityControlFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['createQualityControl'];
  onChange: (
    field: keyof WorkOrderActionForms['createQualityControl'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 5"
      step="Paso 1"
      title="Crear Control de Calidad"
      colorClass="purple"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Creado por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>
    <BoolToggle
      label="Resultado inicial del control"
      trueLabel="Aprobado"
      falseLabel="Pendiente / Rechazado"
      value={form.approved}
      onChange={(v) => onChange('approved', v)}
    />
    <F label="Comentarios">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Observaciones del control de calidad..."
        value={form.comments}
        onChange={(e) => onChange('comments', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 5 — Detalle de control de calidad
// ─────────────────────────────────────────────────────────────────────────────

export const AddQualityDetailFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['addQualityControlDetail'];
  onChange: (
    field: keyof WorkOrderActionForms['addQualityControlDetail'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 5"
      step="Paso 2"
      title="Agregar Detalle de Control de Calidad"
      colorClass="purple"
    />
    <Row>
      <F label="OT ID" required>
        <input
          className="wof__input"
          type="text"
          placeholder="UUID OT"
          value={form.workOrderId}
          onChange={(e) => onChange('workOrderId', e.target.value)}
        />
      </F>
      <F label="Control ID" required>
        <input
          className="wof__input"
          type="text"
          placeholder="UUID control"
          value={form.controlId}
          onChange={(e) => onChange('controlId', e.target.value)}
        />
      </F>
    </Row>
    <Row>
      <F label="Código del ítem" required hint="Ej: QC-01, QC-02">
        <input
          className="wof__input"
          type="text"
          placeholder="QC-01"
          value={form.code}
          onChange={(e) => onChange('code', e.target.value)}
        />
      </F>
      <F label="Creado por (User ID)" required>
        <input
          className="wof__input"
          type="text"
          value={form.createdByUserId}
          onChange={(e) => onChange('createdByUserId', e.target.value)}
        />
      </F>
    </Row>
    <BoolToggle
      label="¿El ítem pasa el control de calidad?"
      trueLabel="Pasa"
      falseLabel="No pasa"
      value={form.passed}
      onChange={(v) => onChange('passed', v)}
    />
    <F label="Comentario">
      <textarea
        className="wof__textarea"
        rows={2}
        placeholder="Observación del ítem..."
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 5 — Resolver control de calidad (gateway)
// ─────────────────────────────────────────────────────────────────────────────

export const ResolveQualityFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['resolveQualityControl'];
  onChange: (
    field: keyof WorkOrderActionForms['resolveQualityControl'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 5"
      step="Gateway"
      title="Resolver Control de Calidad"
      colorClass="purple"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Usuario ID" required>
      <input
        className="wof__input"
        type="text"
        value={form.userId}
        onChange={(e) => onChange('userId', e.target.value)}
      />
    </F>
    <BoolToggle
      label="¿Aprobado?"
      trueLabel="Aprobado → COMPLETADA"
      falseLabel="Rechazado → RECHAZADA_TECNICA"
      value={form.approved}
      onChange={(v) => onChange('approved', v)}
    />
    <F label="Comentario de resolución">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Justificación del resultado del control..."
        value={form.comment}
        onChange={(e) => onChange('comment', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FASE 6 — Encuesta de satisfacción
// ─────────────────────────────────────────────────────────────────────────────

const STARS = [1, 2, 3, 4, 5];

export const SatisfactionSurveyFormUI = ({
  form,
  onChange
}: {
  form: WorkOrderActionForms['registerSatisfactionSurvey'];
  onChange: (
    field: keyof WorkOrderActionForms['registerSatisfactionSurvey'],
    value: any
  ) => void;
}) => (
  <div className="wof__form">
    <PhaseHeader
      phase="Fase 6"
      step="Paso 3"
      title="Registrar Encuesta de Satisfacción"
      colorClass="green"
    />
    <F label="OT ID" required>
      <input
        className="wof__input"
        type="text"
        placeholder="UUID OT"
        value={form.workOrderId}
        onChange={(e) => onChange('workOrderId', e.target.value)}
      />
    </F>
    <F label="Creado por (User ID)" required>
      <input
        className="wof__input"
        type="text"
        value={form.createdByUserId}
        onChange={(e) => onChange('createdByUserId', e.target.value)}
      />
    </F>
    <F label="Calificación (1–5)">
      <div className="wof__stars">
        {STARS.map((s) => (
          <button
            key={s}
            type="button"
            className={`wof__star${Number(form.rating) >= s ? ' wof__star--active' : ''}`}
            onClick={() => onChange('rating', String(s))}
            title={`${s} estrella${s > 1 ? 's' : ''}`}
          >
            <Star size={22} />
          </button>
        ))}
        <span className="wof__star-label">{form.rating} / 5</span>
      </div>
    </F>
    <F label="Comentarios">
      <textarea
        className="wof__textarea"
        rows={3}
        placeholder="Retroalimentación del cliente sobre el servicio..."
        value={form.comments}
        onChange={(e) => onChange('comments', e.target.value)}
      />
    </F>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Dispatcher — renders the correct form for the selected action
// ─────────────────────────────────────────────────────────────────────────────

import type { WorkOrderActionKey } from '../hooks/workOrderProcess.types';

interface ActionFormDispatcherProps {
  actionKey: WorkOrderActionKey;
  forms: WorkOrderActionForms;
  setField: <K extends keyof WorkOrderActionForms>(
    formKey: K,
    field: keyof WorkOrderActionForms[K],
    value: WorkOrderActionForms[K][keyof WorkOrderActionForms[K]]
  ) => void;
}

export const ActionFormDispatcher = ({
  actionKey,
  forms,
  setField
}: ActionFormDispatcherProps) => {
  switch (actionKey) {
    case 'create-work-order':
      return (
        <CreateWorkOrderFormUI
          form={forms.createWorkOrder}
          onChange={(f, v) => setField('createWorkOrder', f as any, v as any)}
        />
      );
    case 'receive-work-order':
      return (
        <ReceiveWorkOrderFormUI
          form={forms.receiveWorkOrder}
          onChange={(f, v) => setField('receiveWorkOrder', f as any, v)}
        />
      );
    case 'assign-work-order-to-crew':
    case 'assign-work-order-to-worker':
      return (
        <AssignWorkerFormUI
          form={forms.assignWorkOrderToWorker}
          onChange={(f, v) => setField('assignWorkOrderToWorker', f as any, v)}
        />
      );
    case 'start-preparation':
      return (
        <StartPreparationFormUI
          form={forms.startPreparation}
          onChange={(f, v) => setField('startPreparation', f as any, v)}
        />
      );
    case 'create-preparation-inspection':
      return (
        <CreateInspectionFormUI
          form={forms.createPreparationInspection}
          onChange={(f, v) =>
            setField('createPreparationInspection', f as any, v as any)
          }
        />
      );
    case 'add-preparation-inspection-detail':
      return (
        <AddInspectionDetailFormUI
          form={forms.addPreparationInspectionDetail}
          onChange={(f, v) =>
            setField('addPreparationInspectionDetail', f as any, v as any)
          }
        />
      );
    case 'resolve-preparation-inspection':
      return (
        <ResolveInspectionFormUI
          form={forms.resolvePreparationInspection}
          onChange={(f, v) =>
            setField('resolvePreparationInspection', f as any, v as any)
          }
        />
      );
    case 'start-execution':
      return (
        <StartExecutionFormUI
          form={forms.startExecution}
          onChange={(f, v) => setField('startExecution', f as any, v)}
        />
      );
    case 'add-work-order-material':
      return (
        <AddMaterialFormUI
          form={forms.addWorkOrderMaterial}
          onChange={(f, v) => setField('addWorkOrderMaterial', f as any, v)}
        />
      );
    case 'add-additional-cost':
      return (
        <AddAdditionalCostFormUI
          form={forms.addAdditionalCost}
          onChange={(f, v) => setField('addAdditionalCost', f as any, v)}
        />
      );
    case 'add-work-order-attachment':
      return (
        <AddAttachmentFormUI
          form={forms.addWorkOrderAttachment}
          onChange={(f, v) => setField('addWorkOrderAttachment', f as any, v)}
        />
      );
    case 'create-quality-control':
      return (
        <CreateQualityControlFormUI
          form={forms.createQualityControl}
          onChange={(f, v) =>
            setField('createQualityControl', f as any, v as any)
          }
        />
      );
    case 'add-quality-control-detail':
      return (
        <AddQualityDetailFormUI
          form={forms.addQualityControlDetail}
          onChange={(f, v) =>
            setField('addQualityControlDetail', f as any, v as any)
          }
        />
      );
    case 'resolve-quality-control':
      return (
        <ResolveQualityFormUI
          form={forms.resolveQualityControl}
          onChange={(f, v) =>
            setField('resolveQualityControl', f as any, v as any)
          }
        />
      );
    case 'complete-work-order':
      return (
        <CompleteWorkOrderFormUI
          form={forms.completeWorkOrder}
          onChange={(f, v) => setField('completeWorkOrder', f as any, v)}
        />
      );
    case 'register-satisfaction-survey':
      return (
        <SatisfactionSurveyFormUI
          form={forms.registerSatisfactionSurvey}
          onChange={(f, v) =>
            setField('registerSatisfactionSurvey', f as any, v as any)
          }
        />
      );
    default:
      return null;
  }
};
