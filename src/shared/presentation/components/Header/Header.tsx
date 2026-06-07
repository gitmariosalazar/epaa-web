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
  Moon,
  Phone,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@/shared/presentation/styles/Header.css';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { FaWhatsapp } from 'react-icons/fa';
import { NotificationBellWrapper } from '@/modules/notifications/presentation/components/NotificationBell/NotificationBellWrapper';

interface SupportTooltipContentProps {
  onSupportClick: () => void;
}

const SupportTooltipContent: React.FC<SupportTooltipContentProps> = ({ onSupportClick }) => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "+593994532438";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = phoneNumber;

    const finalizeCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(finalizeCopy)
        .catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="support-tooltip">
      <div className="support-tooltip__header">
        <div className="support-tooltip__icon-box">
          <Phone size={18} />
        </div>
        <div>
          <span>Soporte Técnico</span>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mario Salazar</p>
        </div>
      </div>

      <div className="support-tooltip__body">
        <span className="support-tooltip__label">WhatsApp Directo</span>
        <div className="support-tooltip__number-row">
          <span className="support-tooltip__number">{phoneNumber}</span>
          <button
            className={`support-tooltip__copy-btn ${copied ? 'support-tooltip__copy-btn--copied' : ''}`}
            onClick={handleCopy}
            type="button"
          >
            {copied ? (
              <div className="support-tooltip__copy-feedback">
                <Check size={14} />
                <span style={{ color: 'white' }}>¡Copiado!</span>
              </div>
            ) : (
              <Tooltip content="Copiar número" themeColor="info">
                <Copy size={14} />
              </Tooltip>
            )}
          </button>
        </div>
      </div>

      <div className="support-tooltip__footer">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSupportClick(); }}
          className="support-tooltip__link support-tooltip__link--whatsapp"
        >
          <FaWhatsapp size={16} />
          <span>Chatear ahora</span>
          <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </a>
      </div>
    </div>
  );
};


export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (supportRef.current && !supportRef.current.contains(event.target as Node)) {
        setIsSupportOpen(false);
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

  const handleSupportClick = () => {
    const phoneNumber = "593994532438";
    const message = `Hola Mario, necesito ayuda con el sistema SIGEPAA. Mi usuario es: ${user?.username || 'Invitado'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  console.log(user);



  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          <h2 className="header__title">{pageTitle}</h2>
        </div>

        <div className="header__right">
          <div className="header__support-container" ref={supportRef}>
            <Tooltip content={t('header.support', 'Soporte Técnico')} themeColor="info" position='top'>
              <button
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className='header__nav-btn header__nav-btn--whatsapp'
              >
                <FaWhatsapp size={22} />
              </button>
            </Tooltip>
            {isSupportOpen && (
              <div className="header__support-dropdown">
                <SupportTooltipContent onSupportClick={handleSupportClick} />
              </div>
            )}
          </div>

          <NotificationBellWrapper />

          <Tooltip content={t('header.switchLang')} themeColor="info">
            <button
              onClick={toggleLanguage}
              className="header__nav-btn"
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>
                {i18n.language === 'en' ? 'EC' : 'US'}
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
                <span className="header__username">{displayName.toUpperCase()}</span>
                <span className="header__user-role">
                  {user?.roles && user.roles.length > 0 ? user.roles[0].name.toUpperCase().replace(/_/g, ' ') : 'Usuario'}
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
                  <div className="header__dropdown-name">{displayName.toUpperCase()}</div>
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
