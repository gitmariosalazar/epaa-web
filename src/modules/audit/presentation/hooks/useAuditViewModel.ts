import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useAuditViewModel = () => {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAuditViewModel must be used within an AuditProvider');

  return context;
};
