import React, { useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import '@/shared/presentation/styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { Moon, Sun, Globe, User, Droplets } from 'lucide-react';
import { FaSignInAlt } from 'react-icons/fa';

// SOLID: Segregating the Left Panel Presentation logic into its own component
const LoginLeftPanel: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="login-left">
      <div className="login-left__shape login-left__shape--1"></div>
      <div className="login-left__shape login-left__shape--2"></div>
      <div className="login-left__shape login-left__shape--3"></div>

      <div className="login-left__company">
        <Droplets size={24} />
        <span>Empresa Pública de Agua Potable y Alcantarillado de Antonio Ante</span>
      </div>

      <div className="login-left__content">
        <h3>{t('Nice to see you again')}</h3>
        <h1>{t('WELCOME BACK')}</h1>
        <div className="login-left__divider"></div>
        <p>
          {t('Bienvenido al sistema de administración. Tu gestión nos ayuda a brindar un mejor servicio a todos nuestros usuarios todos los días.')}
        </p>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { login, token, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthLoading && token) {
      navigate('/', { replace: true });
    }
  }, [token, isAuthLoading, navigate]);

  // Toggle language
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ username_or_email: username, password });
    } catch (err) {
      setError(
        t('Invalid username or password') || 'Invalid username or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Design Pane */}
      <LoginLeftPanel />

      {/* Right Form Pane */}
      <div className="login-right">
        {/* Top right controls */}
        <div className="login-page__controls">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            className="icon-btn"
            onClick={toggleLanguage}
            title="Change Language"
          >
            <Globe size={20} />
            <span className="lang-text">{i18n.language.toUpperCase()}</span>
          </button>
        </div>

        <div className="login-right__container">
          <div className="login-page__header">
            <div className="login-page__logo">
              <img src="epaa.png" alt="EPAA Logo" className="login-page__logo-img" />
            </div>
            <h2 className="login-page__title">{t('Iniciar Sesión')}</h2>
            <p className="login-page__subtitle">
              {t('Ingresa tus credenciales para acceder al sistema EPAA-AA.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-page__form">
            <div className="login-page__input-wrapper">
              <Input
                label=""
                className="login-page__input"
                placeholder={t('Email ID or Username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                leftIcon={<User size={20} />}
              />
            </div>
            <div className="login-page__input-wrapper">
              <PasswordInput
                label=""
                className="login-page__input"
                placeholder={t('Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showStrength={false} // Don't show strength on login
              />
            </div>

            <div className="login-page__options">
              <label>
                <input type="checkbox" />
                {t('Keep me signed in')}
              </label>
              {/* Optional link for future use */}
              {/* <a href="#">{t('Already a member?')}</a> */}
            </div>

            {error && <div className="login-page__error">{error}</div>}

            <Button
              type="submit"
              className="login-page__button"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              leftIcon={<FaSignInAlt size={20} />}
            >
              {t('Iniciar Sesión')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
