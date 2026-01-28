import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        sidebar: {
          dashboard: 'Dashboard',
          users: 'Users',
          roles: 'Roles',
          permissions: 'Permissions',
          settings: 'Settings',
          signOut: 'Sign Out'
        },
        header: {
          profile: 'Profile',
          settings: 'Settings',
          signOut: 'Sign Out',
          switchTheme: 'Switch Theme',
          switchLang: 'Language',
          english: 'English',
          spanish: 'Spanish'
        },
        pages: {
          roles: {
            title: 'Roles',
            createRole: 'Create Role',
            columns: {
              id: 'ID',
              name: 'Name',
              description: 'Description',
              active: 'Active',
              actions: 'Actions'
            }
          },
          common: {
            user: 'User'
          },
          login: {
            welcome: 'Welcome Back',
            subtitle: 'Sign in to your EPAA account',
            username: 'Username',
            usernamePlaceholder: 'Enter your username',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            signIn: 'Sign In',
            error: 'Invalid username or password'
          }
        }
      }
    },
    es: {
      translation: {
        sidebar: {
          dashboard: 'Panel Principal',
          users: 'Usuarios',
          roles: 'Roles',
          permissions: 'Permisos',
          settings: 'Configuración',
          signOut: 'Cerrar Sesión'
        },
        header: {
          profile: 'Perfil',
          settings: 'Configuración',
          signOut: 'Cerrar Sesión',
          switchTheme: 'Cambiar Tema',
          switchLang: 'Idioma',
          english: 'Inglés',
          spanish: 'Español'
        },
        pages: {
          roles: {
            title: 'Roles',
            createRole: 'Crear Rol',
            columns: {
              id: 'ID',
              name: 'Nombre',
              description: 'Descripción',
              active: 'Activo',
              actions: 'Acciones'
            }
          },
          common: {
            user: 'Usuario'
          },
          login: {
            welcome: 'Bienvenido',
            subtitle: 'Inicie sesión en su cuenta EPAA',
            username: 'Usuario',
            usernamePlaceholder: 'Ingrese su usuario',
            password: 'Contraseña',
            passwordPlaceholder: 'Ingrese su contraseña',
            signIn: 'Iniciar Sesión',
            error: 'Usuario o contraseña inválidos'
          }
        }
      }
    }
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
