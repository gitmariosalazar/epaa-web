/**
 * useNotificationBell — presentation hook (SRP)
 * Manages only the bell dropdown state:
 *  - open/close
 *  - tab (all | unread)
 *  - date grouping of notifications
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Notification } from '../../domain/model/Notification';

export type BellTab = 'all' | 'unread';

export interface NotificationGroup {
  label: string;
  items: Notification[];
}

/** Groups notifications by relative date label (Today, Yesterday, or a locale date). */
export const groupByDate = (items: Notification[]): NotificationGroup[] => {
  const today     = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const fmt = (d: Date) => d.toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });

  const map = new Map<string, Notification[]>();

  for (const n of items) {
    const d    = new Date(n.createdAt);
    let label: string;
    if (fmt(d) === fmt(today))     label = 'Hoy';
    else if (fmt(d) === fmt(yesterday)) label = 'Ayer';
    else label = fmt(d);

    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(n);
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
};

export interface UseNotificationBellReturn {
  isOpen:       boolean;
  open:         () => void;
  close:        () => void;
  toggle:       () => void;
  tab:          BellTab;
  setTab:       (t: BellTab) => void;
  panelRef:     React.RefObject<HTMLDivElement | null>;
  triggerRef:   React.RefObject<HTMLButtonElement | null>;
}

export const useNotificationBell = (): UseNotificationBellReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab]       = useState<BellTab>('all');
  const panelRef            = useRef<HTMLDivElement>(null);
  const triggerRef          = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current   && !panelRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen]);

  const open   = useCallback(() => setIsOpen(true),       []);
  const close  = useCallback(() => setIsOpen(false),      []);
  const toggle = useCallback(() => setIsOpen((v) => !v),  []);

  return { isOpen, open, close, toggle, tab, setTab, panelRef, triggerRef };
};
