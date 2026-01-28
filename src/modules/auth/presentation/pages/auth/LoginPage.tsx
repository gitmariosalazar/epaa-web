import React, { useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import '@/shared/presentation/styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { Moon, Sun, Globe, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      navigate('/');
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
      <div className="login-page__background"></div>

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

      <Card className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__logo">
            <img src="epaa.png" alt="" className="login-page__logo-img" />
          </div>
          <h2 className="login-page__title">{t('Sign In')}</h2>
          <p className="login-page__subtitle">{t('Welcome to EPAA-Web')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          <Input
            label={t('Username or Email')}
            placeholder={t('Username or Email')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            leftIcon={<User size={20} />}
          />
          <PasswordInput
            label={t('Password')}
            placeholder={t('Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showStrength={false} // Don't show strength on login
          />

          {error && <div className="login-page__error">{error}</div>}

          <Button
            type="submit"
            className="login-page__button"
            isLoading={isLoading}
            variant="primary"
            size="lg"
          >
            {t('Sign In')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
