import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

type WidgetId = string;

interface DashboardFocusContextType {
  activeWidgetId: WidgetId | null;
  registerWidget: (
    id: WidgetId,
    title: string,
    component: React.ReactNode
  ) => void;
  unregisterWidget: (id: WidgetId) => void;
  openWidget: (id: WidgetId) => void;
  closeWidget: () => void;
  nextWidget: () => void;
  prevWidget: () => void;
  openFirstWidget: () => void;
  getWidget: (
    id: WidgetId
  ) => { title: string; component: React.ReactNode } | undefined;
}

const DashboardFocusContext = createContext<
  DashboardFocusContextType | undefined
>(undefined);

export const useDashboardFocus = () => {
  const context = useContext(DashboardFocusContext);
  if (!context) {
    throw new Error(
      'useDashboardFocus must be used within a DashboardFocusProvider'
    );
  }
  return context;
};

export const DashboardFocusProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeWidgetId, setActiveWidgetId] = useState<WidgetId | null>(null);
  const [widgets, setWidgets] = useState<
    Map<WidgetId, { title: string; component: React.ReactNode }>
  >(new Map());
  // Keep track of insertion order for navigation
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>([]);

  const registerWidget = useCallback(
    (id: WidgetId, title: string, component: React.ReactNode) => {
      setWidgets((prev) => {
        const newMap = new Map(prev);
        newMap.set(id, { title, component });
        return newMap;
      });
      setWidgetOrder((prev) => {
        if (!prev.includes(id)) return [...prev, id];
        return prev;
      });
    },
    []
  );

  const unregisterWidget = useCallback((id: WidgetId) => {
    setWidgets((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
    setWidgetOrder((prev) => prev.filter((wId) => wId !== id));
  }, []);

  const openWidget = useCallback((id: WidgetId) => {
    setActiveWidgetId(id);
  }, []);

  const closeWidget = useCallback(() => {
    setActiveWidgetId(null);
  }, []);

  const nextWidget = useCallback(() => {
    if (!activeWidgetId) return;
    const currentIndex = widgetOrder.indexOf(activeWidgetId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % widgetOrder.length;
    setActiveWidgetId(widgetOrder[nextIndex]);
  }, [activeWidgetId, widgetOrder]);

  const prevWidget = useCallback(() => {
    if (!activeWidgetId) return;
    const currentIndex = widgetOrder.indexOf(activeWidgetId);
    if (currentIndex === -1) return;
    const prevIndex =
      (currentIndex - 1 + widgetOrder.length) % widgetOrder.length;
    setActiveWidgetId(widgetOrder[prevIndex]);
  }, [activeWidgetId, widgetOrder]);

  const openFirstWidget = useCallback(() => {
    if (widgetOrder.length > 0) {
      setActiveWidgetId(widgetOrder[0]);
    }
  }, [widgetOrder]);

  const getWidget = useCallback((id: WidgetId) => widgets.get(id), [widgets]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeWidgetId) {
        if (e.key === 'Escape') closeWidget();
        if (e.key === 'ArrowRight') nextWidget();
        if (e.key === 'ArrowLeft') prevWidget();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWidgetId, closeWidget, nextWidget, prevWidget]);

  return (
    <DashboardFocusContext.Provider
      value={{
        activeWidgetId,
        registerWidget,
        unregisterWidget,
        openWidget,
        closeWidget,
        nextWidget,
        prevWidget,
        openFirstWidget,
        getWidget
      }}
    >
      {children}
    </DashboardFocusContext.Provider>
  );
};
