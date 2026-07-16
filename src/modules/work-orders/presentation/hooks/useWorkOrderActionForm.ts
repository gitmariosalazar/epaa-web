/**
 * useWorkOrderActionForm
 *
 * SRP: owns the form state for each work-order action.
 * OCP: adding a new action field = extend the matching sub-state, nothing else changes.
 * DIP: accepts userId from outside so the hook is not coupled to AuthContext.
 */
import { useState, useCallback } from 'react';
import type { WorkOrderActionKey } from './workOrderProcess.types';

// ── Per-action form state ────────────────────────────────────────────────────

export interface CreateWorkOrderForm {
  origin: string;
  workTypeId: string;
  priorityId: string;
  clientId: string;
  cadastralKey: string;
  description: string;
  location: string;
  longitude: string;
  latitude: string;
  createdByUserId: string;
}

export interface TransitionForm {
  workOrderId: string;
  userId: string;
  comment: string;
}

export interface AssignCrewForm {
  workOrderId: string;
  crewId: string;
  assignedByUserId: string;
  comment: string;
}

export interface AssignWorkerForm {
  workOrderId: string;
  workerId: string;
  assignedByUserId: string;
  comment: string;
}

export interface CreateInspectionForm {
  workOrderId: string;
  crewId: string;
  createdByUserId: string;
  passed: boolean;
  observations: string;
}

export interface AddInspectionDetailForm {
  workOrderId: string;
  inspectionId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment: string;
}

export interface ResolveInspectionForm {
  workOrderId: string;
  userId: string;
  passed: boolean;
  comment: string;
}

export interface AddMaterialForm {
  workOrderId: string;
  materialId: string;
  quantity: string;
  unitCost: string;
  createdByUserId: string;
}

export interface AddAdditionalCostForm {
  workOrderId: string;
  concept: string;
  quantity: string;
  unitCost: string;
  createdByUserId: string;
}

export interface AddAttachmentForm {
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  createdByUserId: string;
}

export interface CreateQualityControlForm {
  workOrderId: string;
  createdByUserId: string;
  approved: boolean;
  comments: string;
}

export interface AddQualityDetailForm {
  workOrderId: string;
  controlId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment: string;
}

export interface ResolveQualityForm {
  workOrderId: string;
  userId: string;
  approved: boolean;
  comment: string;
}

export interface SatisfactionSurveyForm {
  workOrderId: string;
  rating: string;
  createdByUserId: string;
  comments: string;
}

export interface WorkOrderActionForms {
  createWorkOrder: CreateWorkOrderForm;
  receiveWorkOrder: TransitionForm;
  assignWorkOrderToCrew: AssignCrewForm;
  assignWorkOrderToWorker: AssignWorkerForm;
  startPreparation: TransitionForm;
  createPreparationInspection: CreateInspectionForm;
  addPreparationInspectionDetail: AddInspectionDetailForm;
  resolvePreparationInspection: ResolveInspectionForm;
  startExecution: TransitionForm;
  addWorkOrderMaterial: AddMaterialForm;
  addAdditionalCost: AddAdditionalCostForm;
  addWorkOrderAttachment: AddAttachmentForm;
  createQualityControl: CreateQualityControlForm;
  addQualityControlDetail: AddQualityDetailForm;
  resolveQualityControl: ResolveQualityForm;
  completeWorkOrder: TransitionForm;
  registerSatisfactionSurvey: SatisfactionSurveyForm;
}

const initialForms = (userId: string): WorkOrderActionForms => ({
  createWorkOrder: {
    origin: 'TRAMITE',
    workTypeId: '',
    priorityId: '',
    clientId: '',
    cadastralKey: '',
    description: '',
    location: '',
    longitude: '',
    latitude: '',
    createdByUserId: userId
  },
  receiveWorkOrder: { workOrderId: '', userId, comment: '' },
  assignWorkOrderToCrew: {
    workOrderId: '',
    crewId: '',
    assignedByUserId: userId,
    comment: ''
  },
  assignWorkOrderToWorker: {
    workOrderId: '',
    workerId: '',
    assignedByUserId: userId,
    comment: ''
  },
  startPreparation: { workOrderId: '', userId, comment: '' },
  createPreparationInspection: {
    workOrderId: '',
    crewId: '',
    createdByUserId: userId,
    passed: true,
    observations: ''
  },
  addPreparationInspectionDetail: {
    workOrderId: '',
    inspectionId: '',
    code: '',
    passed: true,
    createdByUserId: userId,
    comment: ''
  },
  resolvePreparationInspection: {
    workOrderId: '',
    userId,
    passed: true,
    comment: ''
  },
  startExecution: { workOrderId: '', userId, comment: '' },
  addWorkOrderMaterial: {
    workOrderId: '',
    materialId: '',
    quantity: '1',
    unitCost: '',
    createdByUserId: userId
  },
  addAdditionalCost: {
    workOrderId: '',
    concept: '',
    quantity: '1',
    unitCost: '',
    createdByUserId: userId
  },
  addWorkOrderAttachment: {
    workOrderId: '',
    fileName: '',
    fileType: 'FOTO',
    fileUrl: '',
    createdByUserId: userId
  },
  createQualityControl: {
    workOrderId: '',
    createdByUserId: userId,
    approved: true,
    comments: ''
  },
  addQualityControlDetail: {
    workOrderId: '',
    controlId: '',
    code: '',
    passed: true,
    createdByUserId: userId,
    comment: ''
  },
  resolveQualityControl: {
    workOrderId: '',
    userId,
    approved: true,
    comment: ''
  },
  completeWorkOrder: { workOrderId: '', userId, comment: '' },
  registerSatisfactionSurvey: {
    workOrderId: '',
    rating: '5',
    createdByUserId: userId,
    comments: ''
  }
});

// ── Key mapping action → form key ────────────────────────────────────────────

type FormKey = keyof WorkOrderActionForms;

const ACTION_TO_FORM_KEY: Record<WorkOrderActionKey, FormKey> = {
  'create-work-order': 'createWorkOrder',
  'receive-work-order': 'receiveWorkOrder',
  'assign-work-order-to-crew': 'assignWorkOrderToCrew',
  'assign-work-order-to-worker': 'assignWorkOrderToWorker',
  'start-preparation': 'startPreparation',
  'create-preparation-inspection': 'createPreparationInspection',
  'add-preparation-inspection-detail': 'addPreparationInspectionDetail',
  'resolve-preparation-inspection': 'resolvePreparationInspection',
  'start-execution': 'startExecution',
  'add-work-order-material': 'addWorkOrderMaterial',
  'add-additional-cost': 'addAdditionalCost',
  'add-work-order-attachment': 'addWorkOrderAttachment',
  'create-quality-control': 'createQualityControl',
  'add-quality-control-detail': 'addQualityControlDetail',
  'resolve-quality-control': 'resolveQualityControl',
  'complete-work-order': 'completeWorkOrder',
  'complete-inspection-work-order': 'completeWorkOrder',
  'complete-installation-work-order': 'completeWorkOrder',
  'register-satisfaction-survey': 'registerSatisfactionSurvey'
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useWorkOrderActionForm = (userId: string) => {
  const [forms, setForms] = useState<WorkOrderActionForms>(() =>
    initialForms(userId)
  );

  const setField = useCallback(
    <K extends FormKey, F extends WorkOrderActionForms[K]>(
      formKey: K,
      field: keyof F,
      value: F[keyof F]
    ) => {
      setForms((prev) => ({
        ...prev,
        [formKey]: { ...prev[formKey], [field]: value }
      }));
    },
    []
  );

  const getFormForAction = useCallback(
    (action: WorkOrderActionKey) => {
      const key = ACTION_TO_FORM_KEY[action];
      return forms[key];
    },
    [forms]
  );

  const buildPayload = useCallback(
    (action: WorkOrderActionKey): Record<string, unknown> => {
      const key = ACTION_TO_FORM_KEY[action];
      const form = forms[key] as unknown as Record<string, unknown>;

      // Coerce numeric strings to numbers where needed
      const numFields: Record<string, string[]> = {
        createWorkOrder: ['workTypeId', 'priorityId', 'longitude', 'latitude'],
        addWorkOrderMaterial: ['materialId', 'quantity', 'unitCost'],
        addAdditionalCost: ['quantity', 'unitCost'],
        registerSatisfactionSurvey: ['rating']
      };

      const result = { ...form };
      for (const f of numFields[key] ?? []) {
        if (result[f] !== '' && result[f] !== undefined) {
          result[f] = Number(result[f]);
        }
      }

      return result;
    },
    [forms]
  );

  return {
    forms,
    setField,
    getFormForAction,
    buildPayload,
    ACTION_TO_FORM_KEY
  };
};
