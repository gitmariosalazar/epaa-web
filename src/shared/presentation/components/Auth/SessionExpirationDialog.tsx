import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../Button/Button';
import './SessionExpirationDialog.css';

interface SessionExpirationDialogProps {
  isOpen: boolean;
  onExtend: () => void;
  onCancel: () => void;
  isExtending?: boolean;
}

export const SessionExpirationDialog: React.FC<
  SessionExpirationDialogProps
> = ({ isOpen, onExtend, onCancel, isExtending = false }) => {
  if (!isOpen) return null;

  return (
    <div className="session-dialog-overlay">
      <div className="session-dialog" role="dialog" aria-modal="true">
        <div className="session-dialog__icon">
          <AlertTriangle size={32} />
        </div>

        <h2 className="session-dialog__title">Session Expired</h2>

        <p className="session-dialog__message">
          Your session has effectively expired due to inactivity. Would you like
          to extend your session or log out?
        </p>

        <div className="session-dialog__actions">
          <Button variant="ghost" onClick={onCancel} disabled={isExtending}>
            Log Out
          </Button>
          <Button variant="primary" onClick={onExtend} isLoading={isExtending}>
            Extend Session
          </Button>
        </div>
      </div>
    </div>
  );
};
