/* src/shared/presentation/components/Header/Header.tsx */
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@/shared/presentation/styles/Header.css';
import { Tooltip } from '../common/Tooltip/Tooltip';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = async () => {
    await logout();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || t('common.user');

  // Derive title from path for professional feel
  const currentPath = location.pathname.split('/').pop() || '';
  const pageTitle = currentPath
    ? t(
        `menu.${currentPath}`,
        currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
      )
    : '';

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          <h2 className="header__title">{pageTitle}</h2>
        </div>

        <div className="header__right">
          <Tooltip content={t('header.switchLang')} themeColor="info">
            <button
              onClick={toggleLanguage}
              title={t('header.switchLang')}
              className="header__nav-btn"
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>
                {i18n.language === 'en' ? '🇪🇨' : '🇺🇸'}
              </span>
              <span>{i18n.language === 'en' ? 'ES' : 'EN'}</span>
            </button>
          </Tooltip>

          <Tooltip content={t('header.switchTheme')} themeColor="info">
            <button
              onClick={toggleTheme}
              className="header__nav-btn header__nav-btn--theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </Tooltip>

          <div className="header__actions" ref={menuRef}>
            <div
              className={`header__user-menu-trigger ${isMenuOpen ? 'header__user-menu-trigger--active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Avatar name={displayName} size="md" />
              <div className="header__user-info">
                <span className="header__username">{displayName}</span>
                <span className="header__user-role">
                  {user?.firstName ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              <div className="header__chevron-wrapper">
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
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <UserIcon size={18} /> {t('header.profile')}
                  </li>
                  <li
                    className="header__dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Settings size={18} /> {t('header.settings')}
                  </li>
                  <li className="header__dropdown-divider"></li>
                  <li
                    className="header__dropdown-item header__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> {t('header.signOut')}
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
