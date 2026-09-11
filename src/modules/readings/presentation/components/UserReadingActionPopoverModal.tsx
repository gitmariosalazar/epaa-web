import { type UserReadingActionAuditSqlResul } from '@/modules/readings/domain/models/ReadingInfoResponse';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { Button } from '@mui/material';
import React, { useMemo } from 'react';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Activity, FileText } from 'lucide-react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import './UserReadingActionPopoverModal.css';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { ConverDateTime } from '@/shared/utils/datetime/ConverDate';

export interface UserReadingActionPopoverModalProps {
  userActions?: UserReadingActionAuditSqlResul[];
  trigger?: React.ReactElement<any>;
}

export const UserReadingActionPopoverModal: React.FC<UserReadingActionPopoverModalProps> = ({
  userActions,
  trigger
}) => {
  const columns: Column<UserReadingActionAuditSqlResul>[] = useMemo(() => [
    {
      header: 'Acción',
      accessor: (action) => (
        <ColorChip label={action.action} size='xs' color={
          action.action === 'Creation' ? 'green' :
            action.action === 'Update' ? 'yellow' :
              'red'
        } variant='soft' icon={<Activity size={12} />} />
      )
    },
    {
      header: 'Usuario',
      accessor: (action) => (
        <div className="history-user-info">
          <span className="history-user-name">{action.firstName} {action.lastName}</span>
          <span className="history-username-sub">
            @{action.username} | {action.adjustmentDate ? ConverDateTime(action.adjustmentDate) : 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: 'Justificación',
      accessor: (action) => {
        if (!action.justification) {
          return <span style={{ color: '#64748b', fontSize: '0.8rem' }}>N/A</span>;
        }
        return (
          <Tooltip content={
            <div className="tooltip-justification-content">
              <div className="tooltip-section">
                <span className="tooltip-section-title">Justificación</span>
                <p className="tooltip-section-text">{action.justification}</p>
              </div>

              {(action.previousReading !== null || action.newReading !== null) && (
                <div className="tooltip-section tooltip-changes-section">
                  <span className="tooltip-section-title">Cambio de Lectura</span>
                  <div className="tooltip-changes-grid">
                    <div className="tooltip-change-box old-value">
                      <span className="change-label">Anterior</span>
                      <span className="change-value">{action.previousReading ?? '-'}</span>
                    </div>
                    <div className="tooltip-change-arrow">➔</div>
                    <div className="tooltip-change-box new-value">
                      <span className="change-label">Nueva</span>
                      <span className="change-value">{action.newReading ?? '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          } followCursor={false}>
            <span className="history-justification">
              <FileText size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle', color: '#94a3b8' }} />
              {truncateText(action.justification, 20)}
            </span>
          </Tooltip>
        );
      }
    }
  ], []);


  console.log(userActions)

  return (
    <PopoverModal
      title="Historial de Cambios de Lectura"
      trigger={trigger || <Button variant="outlined" size="small">Historial</Button>}
    >
      <div className="reading-history-container" >
        <Table
          data={userActions || []}
          columns={columns}
          pagination={false}
          emptyState={
            <EmptyState
              message='No hay historial de acciones para esta lectura'
              variant='warning'
              icon={<BsPatchQuestionFill size={35} />}
            />
          }
        />
      </div>
    </PopoverModal>
  );
};
