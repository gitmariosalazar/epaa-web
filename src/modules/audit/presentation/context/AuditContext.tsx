import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ApiAuditRepository } from '../../infrastructure/repositories/ApiAuditRepository';
import { GetAuditLogsUseCase } from '../../application/useCases/GetAuditLogsUseCase';
import { GetSessionLogsUseCase } from '../../application/useCases/GetSessionLogsUseCase';
import type { 
  GetAuditLogsParams, 
  GetSessionLogsParams, 
  AuditRegistroResponse, 
  AuditSessionResponse 
} from '../../domain/models/AuditModels';

export type AuditTab = 'sessions' | 'data';

interface AuditState {
  auditLogs: AuditRegistroResponse[];
  sessionLogs: AuditSessionResponse[];
  isLoading: boolean;
  error: string | null;
  activeTab: AuditTab;
  searchQuery: string;
  searchField: string;
  selectedOperation: string;
  selectedEvent: string;
  userIdFilter: string;
  usernameFilter: string;
  startDate: string;
  endDate: string;
}

interface AuditActions {
  setActiveTab: (tab: AuditTab) => void;
  setSearchQuery: (val: string) => void;
  setSearchField: (val: string) => void;
  setSelectedOperation: (val: string) => void;
  setSelectedEvent: (val: string) => void;
  setUserIdFilter: (val: string) => void;
  setUsernameFilter: (val: string) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  handleFetch: () => void;
  fetchAuditLogs: (params?: GetAuditLogsParams) => Promise<void>;
  fetchSessionLogs: (params?: GetSessionLogsParams) => Promise<void>;
}

interface AuditContextProps {
  state: AuditState;
  actions: AuditActions;
}

export const AuditContext = createContext<AuditContextProps | undefined>(undefined);

function applyLocalFilters<T>(data: T[], searchQuery: string, searchField: string): T[] {
  if (!searchQuery) return data;
  const q = searchQuery.toLowerCase().trim();
  return data.filter((item: any) => {
    if (searchField === 'all') {
      return Object.values(item).some(val => String(val).toLowerCase().includes(q));
    }
    return String(item[searchField] ?? '').toLowerCase().includes(q);
  });
}

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const repository = useMemo(() => new ApiAuditRepository(), []);
  const getAuditLogsUseCase = useMemo(() => new GetAuditLogsUseCase(repository), [repository]);
  const getSessionLogsUseCase = useMemo(() => new GetSessionLogsUseCase(repository), [repository]);

  const [auditLogs, setAuditLogs] = useState<AuditRegistroResponse[]>([]);
  const [sessionLogs, setSessionLogs] = useState<AuditSessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AuditTab>('sessions');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAuditLogs = useCallback(async (params: GetAuditLogsParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAuditLogsUseCase.execute({ limit: 100, offset: 0, ...params });
      setAuditLogs(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [getAuditLogsUseCase]);

  const fetchSessionLogs = useCallback(async (params: GetSessionLogsParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSessionLogsUseCase.execute({ limit: 100, offset: 0, ...params });
      setSessionLogs(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching session logs');
    } finally {
      setIsLoading(false);
    }
  }, [getSessionLogsUseCase]);

  const handleFetch = useCallback(() => {
    if (activeTab === 'data') {
      fetchAuditLogs({ 
        searchQuery, 
        searchField, 
        operation: selectedOperation || undefined, 
        userId: userIdFilter || undefined,
        username: usernameFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
    } else {
      fetchSessionLogs({ 
        searchQuery, 
        searchField, 
        event: selectedEvent || undefined, 
        userId: userIdFilter || undefined,
        username: usernameFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
    }
  }, [activeTab, searchQuery, searchField, selectedOperation, selectedEvent, userIdFilter, usernameFilter, startDate, endDate, fetchAuditLogs, fetchSessionLogs]);

  const filteredAuditLogs = useMemo(() => {
    let result = auditLogs;
    
    // Aplicamos filtros locales sobre los resultados obtenidos (robustos ante fallos de API)
    if (selectedOperation) {
      result = result.filter(log => log.operation === selectedOperation);
    }
    
    if (userIdFilter) {
      const u = userIdFilter.toLowerCase();
      result = result.filter(log => String(log.userId || '').toLowerCase().includes(u));
    }
    
    if (usernameFilter) {
      const u = usernameFilter.toLowerCase();
      result = result.filter(log => String(log.username || '').toLowerCase().includes(u));
    }

    return applyLocalFilters(result, searchQuery, searchField);
  }, [auditLogs, searchQuery, searchField, selectedOperation, userIdFilter, usernameFilter]);

  const filteredSessionLogs = useMemo(() => {
    let result = sessionLogs;
    
    if (selectedEvent) {
      result = result.filter(log => log.event === selectedEvent);
    }
    
    if (userIdFilter) {
      const u = userIdFilter.toLowerCase();
      result = result.filter(log => String(log.userId || '').toLowerCase().includes(u));
    }
    
    if (usernameFilter) {
      const u = usernameFilter.toLowerCase();
      result = result.filter(log => String(log.username || '').toLowerCase().includes(u));
    }

    return applyLocalFilters(result, searchQuery, searchField);
  }, [sessionLogs, searchQuery, searchField, selectedEvent, userIdFilter, usernameFilter]);

  const value = {
    state: {
      auditLogs: filteredAuditLogs,
      sessionLogs: filteredSessionLogs,
      isLoading,
      error,
      activeTab,
      searchQuery,
      searchField,
      selectedOperation,
      selectedEvent,
      userIdFilter,
      usernameFilter,
      startDate,
      endDate,
    },
    actions: {
      setActiveTab,
      setSearchQuery,
      setSearchField,
      setSelectedOperation,
      setSelectedEvent,
      setUserIdFilter,
      setUsernameFilter,
      setStartDate,
      setEndDate,
      handleFetch,
      fetchAuditLogs,
      fetchSessionLogs,
    }
  };

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
};
