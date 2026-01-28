import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
// import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Moon, Sun, Globe, Bell, Shield, Smartphone } from 'lucide-react';
import '@/shared/presentation/styles/settings.css';

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  // const { user } = useAuth(); // Could be used if we show user info here

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>{t('sidebar.settings')}</h1>
        <p>Manage your application preferences and account settings</p>
      </div>

      {/* Appearance Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2>
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            Appearance
          </h2>
        </div>
        <div className="settings-section-content">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Dark Mode</span>
              <span className="setting-desc">
                Adjust the appearance of the application to reduce eye strain.
              </span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2>
            <Globe size={20} />
            Language
          </h2>
        </div>
        <div className="settings-section-content">
          <div className="setting-info">
            <span className="setting-label">Select Language</span>
            <span className="setting-desc">
              Choose the language for the dashboard interface.
            </span>
          </div>

          <div className="language-grid">
            <div
              className={`lang-option ${i18n.language === 'en' ? 'selected' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              English
            </div>
            <div
              className={`lang-option ${i18n.language === 'es' ? 'selected' : ''}`}
              onClick={() => changeLanguage('es')}
            >
              Español
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2>
            <Bell size={20} />
            Notifications
          </h2>
        </div>
        <div className="settings-section-content">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Email Notifications</span>
              <span className="setting-desc">
                Receive weekly summaries and critical alerts via email.
              </span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Push Notifications</span>
              <span className="setting-desc">
                Receive real-time alerts in your browser.
              </span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section Stub */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2>
            <Shield size={20} />
            Security (Read Only)
          </h2>
        </div>
        <div className="settings-section-content">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Two-Factor Authentication</span>
              <span className="setting-desc">
                Currently disabled by system policy. Contact admin to enable.
              </span>
            </div>
            <div className="setting-control">
              <Smartphone size={20} color="#9ca3af" />
            </div>
          </div>
        </div>
      </section>

      <div
        style={{ textAlign: 'right', color: '#9ca3af', fontSize: '0.75rem' }}
      >
        App Version 1.0.0
      </div>
    </div>
  );
};

export default SettingsPage;
