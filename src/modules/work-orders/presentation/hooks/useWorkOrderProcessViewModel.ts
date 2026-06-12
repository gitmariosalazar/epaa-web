import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useWorkOrderProcess } from './useWorkOrderProcess';
import { useWorkOrderActionForm } from './useWorkOrderActionForm';
import type { SortKey, WorkOrderHistoryRow } from './workOrderProcess.types';

const formatDate = (value?: string | null): string => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const sortByKey = (a: any, b: any, sortBy: SortKey): number => {
  if (sortBy === 'codigo') {
    return (a.codigoOrden ?? '').localeCompare(b.codigoOrden ?? '');
  }
  if (sortBy === 'estado') {
    return (a.estadoLabel ?? '').localeCompare(b.estadoLabel ?? '');
  }
  const aDate = new Date(
    a.ultimaActualizacion ?? a.fechaCreacion ?? 0
  ).getTime();
  const bDate = new Date(
    b.ultimaActualizacion ?? b.fechaCreacion ?? 0
  ).getTime();
  return sortBy === 'fecha_asc' ? aDate - bDate : bDate - aDate;
};

export const useWorkOrderProcessViewModel = () => {
  const { user } = useAuth();
  const userId = user?.userId ?? '';
  const process = useWorkOrderProcess();
  const actionForm = useWorkOrderActionForm(userId);

  const [historySearch, setHistorySearch] = useState('');
  const [relatedSearch, setRelatedSearch] = useState('');
  const [relatedSortBy, setRelatedSortBy] = useState<SortKey>('fecha_desc');
  const [relatedPage, setRelatedPage] = useState(1);
  const [relatedPageSize, setRelatedPageSize] = useState(5);

  const historyRows = useMemo<WorkOrderHistoryRow[]>(() => {
    return (
      process.state.tracking?.historial?.map((item) => ({
        estado: item.estadoLabel ?? item.estado,
        fecha: formatDate(item.fecha),
        comentario: item.comentario ?? '-',
        usuarioId: item.usuarioId ?? '-'
      })) ?? []
    );
  }, [process.state.tracking]);

  const filteredHistoryRows = useMemo(() => {
    if (!historySearch.trim()) return historyRows;
    const query = historySearch.toLowerCase();
    return historyRows.filter((row) => {
      return (
        row.estado.toLowerCase().includes(query) ||
        row.fecha.toLowerCase().includes(query) ||
        row.comentario.toLowerCase().includes(query) ||
        row.usuarioId.toLowerCase().includes(query)
      );
    });
  }, [historyRows, historySearch]);

  const filteredSortedRelated = useMemo(() => {
    const query = relatedSearch.trim().toLowerCase();
    const filtered = process.state.ordenesBySolicitud.filter((item) => {
      if (!query) return true;
      return (
        item.codigoOrden.toLowerCase().includes(query) ||
        item.estadoLabel.toLowerCase().includes(query) ||
        item.tipoTrabajo.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => sortByKey(a, b, relatedSortBy));
  }, [process.state.ordenesBySolicitud, relatedSearch, relatedSortBy]);

  const paginatedRelated = useMemo(() => {
    const start = (relatedPage - 1) * relatedPageSize;
    return filteredSortedRelated.slice(start, start + relatedPageSize);
  }, [filteredSortedRelated, relatedPage, relatedPageSize]);

  const clearFilters = useCallback(() => {
    process.setNumeroOrden('');
    process.setSolicitudId('');
    setHistorySearch('');
    setRelatedSearch('');
    setRelatedSortBy('fecha_desc');
    setRelatedPage(1);
    setRelatedPageSize(5);
  }, [process]);

  const executeWithFormPayload = useCallback(async () => {
    const payload = actionForm.buildPayload(process.state.selectedAction);
    await process.executeAction(payload);
  }, [actionForm, process]);

  const setRelatedSearchAndReset = useCallback((value: string) => {
    setRelatedSearch(value);
    setRelatedPage(1);
  }, []);

  const setRelatedSortByAndReset = useCallback((value: SortKey) => {
    setRelatedSortBy(value);
    setRelatedPage(1);
  }, []);

  const setRelatedPageSizeAndReset = useCallback((value: number) => {
    setRelatedPageSize(value);
    setRelatedPage(1);
  }, []);

  return {
    ...process,
    // form state
    actionForms: actionForm.forms,
    setActionField: actionForm.setField,
    executeWithFormPayload,
    // history filter
    historySearch,
    historyRows: filteredHistoryRows,
    totalHistoryRows: historyRows.length,
    setHistorySearch,
    // related filter / sort / pagination
    relatedSearch,
    relatedSortBy,
    relatedPage,
    relatedPageSize,
    relatedRows: paginatedRelated,
    totalRelatedRows: filteredSortedRelated.length,
    setRelatedSearch: setRelatedSearchAndReset,
    setRelatedSortBy: setRelatedSortByAndReset,
    setRelatedPage,
    setRelatedPageSize: setRelatedPageSizeAndReset,
    clearFilters
  };
};
