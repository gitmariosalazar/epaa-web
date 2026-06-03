/**
 * NotificationToolbar
 * Uses the app's shared Tabs, Select, Button, and Modal components.
 * SRP: only manages toolbar UI — emits state changes upward.
 */
import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Tabs }   from '@/shared/presentation/components/Tabs/Tabs';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal }  from '@/shared/presentation/components/Modal/Modal';
import type { TabItem } from '@/shared/presentation/components/Tabs/Tabs';
import type { NotificationTab, SortOrder, NotificationFilter } from '../../hooks/useNotifications';
import './NotificationToolbar.css';

// ── Tab definitions ─────────────────────────────────────────────────────────
const TABS: TabItem<NotificationTab>[] = [
  { id: 'all',    label: 'Todas' },
  { id: 'unread', label: 'No leídas' },
];

// ── Sort options ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'recent', label: 'Más reciente' },
  { value: 'oldest', label: 'Más antiguo' },
];

// ── Channel / Priority filter options ──────────────────────────────────────
const CHANNEL_OPTIONS = [
  { value: '',         label: 'Todos los canales' },
  { value: 'IN_APP',   label: 'En la app' },
  { value: 'EMAIL',    label: 'Email' },
  { value: 'SMS',      label: 'SMS' },
  { value: 'PUSH',     label: 'Push' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
];

const PRIORITY_OPTIONS = [
  { value: '',       label: 'Todas las prioridades' },
  { value: 'LOW',    label: 'Baja' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH',   label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
];

// ── Component ───────────────────────────────────────────────────────────────
export interface NotificationToolbarProps {
  tab:               NotificationTab;
  onTabChange:       (t: NotificationTab) => void;
  unreadCount:       number;
  sortOrder:         SortOrder;
  onSortChange:      (s: SortOrder) => void;
  filter:            NotificationFilter;
  onFilterChange:    (f: NotificationFilter) => void;
  activeFilterCount: number;
  onClearFilters:    () => void;
}

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  tab, onTabChange,
  unreadCount,
  sortOrder, onSortChange,
  filter, onFilterChange,
  activeFilterCount, onClearFilters,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  // local draft while modal is open
  const [draft, setDraft] = useState<NotificationFilter>(filter);

  const openFilter  = () => { setDraft(filter); setFilterOpen(true); };
  const applyFilter = () => { onFilterChange(draft); setFilterOpen(false); };
  const resetFilter = () => { setDraft({ channel: '', priority: '' }); };

  // Augment tabs with badge
  const tabsWithBadge: TabItem<NotificationTab>[] = TABS.map((t) =>
    t.id === 'unread' && unreadCount > 0
      ? { ...t, label: `No leídas (${unreadCount})` }
      : t,
  );

  return (
    <>
      <div className="notif-toolbar" role="toolbar" aria-label="Filtros de notificaciones">
        {/* Shared Tabs */}
        <Tabs<NotificationTab>
          tabs={tabsWithBadge}
          activeTab={tab}
          onTabChange={onTabChange}
          className="notif-toolbar__shared-tabs"
        />

        {/* Right actions */}
        <div className="notif-toolbar__actions">
          {/* Sort — shared Select */}
          <Select
            size="compact"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            options={SORT_OPTIONS}
            aria-label="Ordenar notificaciones"
            className="notif-toolbar__select"
          />

          {/* Filter button — shared Button with active indicator */}
          <Button
            variant={activeFilterCount > 0 ? 'primary' : 'outline'}
            size="compact"
            leftIcon={<SlidersHorizontal size={14} />}
            onClick={openFilter}
            aria-label="Abrir filtros"
          >
            Filtrar{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>

          {/* Clear filters shortcut */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="compact"
              circle
              leftIcon={<X size={14} />}
              onClick={onClearFilters}
              aria-label="Limpiar filtros"
            />
          )}
        </div>
      </div>

      {/* ── Filter Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filtrar notificaciones"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={resetFilter}>
              Restablecer
            </Button>
            <Button variant="primary" onClick={applyFilter}>
              Aplicar filtros
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <Select
            label="Canal"
            value={draft.channel}
            onChange={(e) => setDraft((d) => ({ ...d, channel: e.target.value as any }))}
            options={CHANNEL_OPTIONS}
            size="medium"
          />
          <Select
            label="Prioridad"
            value={draft.priority}
            onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as any }))}
            options={PRIORITY_OPTIONS}
            size="medium"
          />
        </div>
      </Modal>
    </>
  );
};
