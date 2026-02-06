import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { Avatar } from '../Avatar/Avatar';
import {
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@/shared/presentation/styles/Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || t('common.user');

  return (
    <header className="header">
      <div className="header__content">
        <h2 className="header__title"></h2> {/* Dynamic title could be prop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '50%',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
            title={t('header.switchLang')}
            className="theme-toggle"
          >
            {i18n.language === 'en' ? '🇪🇨 ES' : '🇺🇸 EN'}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '50%'
            }}
            title={t('header.switchTheme')}
            className="theme-toggle"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="header__actions" ref={menuRef}>
            <div
              className="header__user-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 16px 6px 6px', // Extra padding on right for balance
                borderRadius: '9999px', // Pill shape
                border: '1px solid var(--border-color)', // Border as requested
                backgroundColor: 'var(--surface)', // Background
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)' // Subtle shadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(var(--primary-rgb), 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Avatar name={displayName} size="md" />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.2
                }}
              >
                <span
                  className="header__username"
                  style={{ fontWeight: 600, fontSize: '0.875rem' }}
                >
                  {displayName}
                </span>
                <span
                  style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}
                >
                  {user?.firstName ? 'Admin' : 'User'}
                </span>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'var(--background)',
                  marginLeft: '4px'
                }}
              >
                <ChevronDown
                  size={14}
                  className={`header__chevron ${isMenuOpen ? 'header__chevron--open' : ''}`}
                />
              </div>
            </div>

            {isMenuOpen && (
              <div className="header__dropdown">
                <div className="header__dropdown-header">
                  <div className="header__dropdown-name">{displayName}</div>
                  <div className="header__dropdown-email">{user?.email}</div>
                </div>
                <ul className="header__dropdown-list">
                  <li
                    className="header__dropdown-item"
                    onClick={() => navigate('/profile')}
                  >
                    <UserIcon size={16} /> {t('header.profile')}
                  </li>
                  <li
                    className="header__dropdown-item"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings size={16} /> {t('header.settings')}
                  </li>
                  <li className="header__dropdown-divider"></li>
                  <li
                    className="header__dropdown-item header__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> {t('header.signOut')}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
