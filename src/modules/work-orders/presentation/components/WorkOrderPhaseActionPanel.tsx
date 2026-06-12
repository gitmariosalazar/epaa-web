import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { ActionFormDispatcher } from './WorkOrderActionForms';
import type {
  WorkOrderActionDefinition,
  WorkOrderActionKey
} from '../hooks/workOrderProcess.types';
import type { WorkOrderActionForms } from '../hooks/useWorkOrderActionForm';
import '../styles/WorkOrderActionForms.css';

interface WorkOrderPhaseActionPanelProps {
  actions: WorkOrderActionDefinition[];
  selectedAction: WorkOrderActionKey;
  selectedActionDef: WorkOrderActionDefinition;
  forms: WorkOrderActionForms;
  isSubmitting: boolean;
  onSelectAction: (key: WorkOrderActionKey) => void;
  onSetField: <K extends keyof WorkOrderActionForms>(
    formKey: K,
    field: keyof WorkOrderActionForms[K],
    value: WorkOrderActionForms[K][keyof WorkOrderActionForms[K]]
  ) => void;
  onExecute: () => void;
}

export const WorkOrderPhaseActionPanel = ({
  actions,
  selectedAction,
  selectedActionDef,
  forms,
  isSubmitting,
  onSelectAction,
  onSetField,
  onExecute
}: WorkOrderPhaseActionPanelProps) => {
  return (
    <Card
      title="Ejecucion por fase"
      className="work-order-process__card work-order-process__card--actions"
      footer={
        <Button
          onClick={onExecute}
          isLoading={isSubmitting}
          fullWidth
          variant="primary"
        >
          Ejecutar — {selectedActionDef.title}
        </Button>
      }
    >
      <div className="work-order-process__action-content">
        <div className="wof__select-row">
          <Select
            label="Accion"
            value={selectedAction}
            onChange={(event) =>
              onSelectAction(event.target.value as WorkOrderActionKey)
            }
            options={actions.map((action) => ({
              value: action.key,
              label: action.title
            }))}
          />
          <div className="wof__action-meta">
            <strong>
              {selectedActionDef.phase.replace('phase-', 'Fase ')} ·{' '}
            </strong>
            {selectedActionDef.description}
          </div>
        </div>

        <ActionFormDispatcher
          actionKey={selectedAction}
          forms={forms}
          setField={onSetField}
        />
      </div>
    </Card>
  );
};
