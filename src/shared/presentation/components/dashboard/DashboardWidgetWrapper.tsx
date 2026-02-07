import React, { useEffect, useState, useRef } from 'react';

import { useDashboardFocus } from './DashboardFocusContext';
import { createPortal } from 'react-dom';
import { DashboardFloatingNavigation } from './DashboardFloatingNavigation';
import './DashboardWidgetWrapper.css';
import './DashboardFocusOverlay.css';

interface DashboardWidgetWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string; // To forward layout styles
}

export const DashboardWidgetWrapper: React.FC<DashboardWidgetWrapperProps> = ({
  id,
  title,
  children,
  className
}) => {
  const { registerWidget, unregisterWidget } = useDashboardFocus();

  // Register the widget's content so it can be rendered in the overlay
  // Update widget content whenever it changes
  useEffect(() => {
    registerWidget(id, title, children);
  }, [id, title, children, registerWidget]);

  // Only unregister on unmount
  useEffect(() => {
    return () => unregisterWidget(id);
  }, [id, unregisterWidget]);

  return (
    <div className={`dashboard-widget-wrapper ${className || ''}`}>
      {children}
    </div>
  );
};

interface DashboardFocusOverlayProps {
  currentMonth?: string;
  onMonthChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardFocusOverlay: React.FC<DashboardFocusOverlayProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const { activeWidgetId, closeWidget, nextWidget, prevWidget, getWidget } =
    useDashboardFocus();

  const [isPaused, setIsPaused] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationClass, setAnimationClass] = useState('anim-ppt-slide-up');

  // Animation variants
  const animations = [
    'anim-ppt-slide-up',
    'anim-ppt-slide-left',
    'anim-ppt-zoom-out',
    'anim-ppt-blur',
    'anim-ppt-flip'
  ];

  // Randomize animation on slide change
  useEffect(() => {
    if (activeWidgetId) {
      const randomIndex = Math.floor(Math.random() * animations.length);
      setAnimationClass(animations[randomIndex]);
    }
  }, [activeWidgetId]);

  // Idle Detection: Pause on interaction, Resume after inactivity
  useEffect(() => {
    const resetIdle = () => {
      setIsPaused(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 5000); // Resume after 5 seconds of no movement
    };

    // Listeners for activity
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    // Initial trigger
    resetIdle();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
    };
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!activeWidgetId || isPaused) return;
    const interval = setInterval(nextWidget, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [activeWidgetId, nextWidget, isPaused]);

  if (!activeWidgetId) return null;

  const activeWidget = getWidget(activeWidgetId);
  if (!activeWidget) return null;

  return createPortal(
    <div className="dashboard-focus-backdrop">
      {/* Container for the maximized content - True Fullscreen */}
      <div className="dashboard-fullscreen-overlay animate-in fade-in zoom-in duration-300">
        {/* Floating Navigation Controls */}
        <DashboardFloatingNavigation
          onPrev={prevWidget}
          onNext={nextWidget}
          onClose={closeWidget}
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
        />

        {/* Content Area */}
        <div className="dashboard-overlay-content-wrapper">
          {/* Animated Content Wrapper */}
          <div
            key={activeWidgetId}
            className={`dashboard-overlay-inner-content ${animationClass}`}
          >
            {activeWidget.component}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
