import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          sidebar: {
            dashboard: 'Dashboard',
            reports: 'Reports',
            security: 'Security',
            profile: 'Profile',
            general: 'General',
            administration: 'Administration',
            user: 'User',
            users: 'Users',
            roles: 'Roles',
            permissions: 'Permissions',
            settings: 'Settings',
            signOut: 'Sign Out'
          },
          dashboard: {
            title: 'Dashboard',
            sectorProgress: {
              title: 'Sector Progress',
              searchPlaceholder: 'Search sector...',
              loading: 'Loading Sector Progress...',
              emptyTitle: 'No Sector Data',
              emptyDescription: 'There are no sectors matching your search.',
              legend: {
                completed: 'Completed',
                remaining: 'Remaining'
              },
              readings: 'Readings',
              pending: 'Pending',
              sector: 'Sector'
            },
            sectorStats: {
              title: 'Sector Analysis',
              searchPlaceholder: 'Search...',
              loading: 'Loading sector stats...',
              empty: 'No sector data available.',
              columns: {
                sector: 'Sector',
                count: 'Count',
                avgConsumption: 'Avg Consumption',
                activeDays: 'Active Days'
              }
            },
            tabs: {
              visual: 'Visual Progress',
              detailed: 'Detailed Table',
              detailedReports: 'Detailed Reports'
            },
            advancedReadings: {
              title: 'Daily Performance',
              searchPlaceholder: 'Search...',
              loading: 'Loading advanced readings...',
              empty: 'No advanced readings available.',
              columns: {
                sector: 'Sector',
                totalConnections: 'Total Connections',
                readingsCompleted: 'Readings Completed',
                missingReadings: 'Missing Readings',
                progress: 'Progress Percentage'
              }
            }
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
          common: {
            pagination: {
              page: 'Page {{current}} of {{total}}'
            }
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
            reports: 'Reportes',
            security: 'Seguridad',
            profile: 'Perfil',
            general: 'General',
            administration: 'Administración',
            user: 'Usuario',
            users: 'Usuarios',
            roles: 'Roles',
            permissions: 'Permisos',
            settings: 'Configuración',
            signOut: 'Cerrar Sesión'
          },
          dashboard: {
            title: 'Panel Principal',
            sectorProgress: {
              title: 'Progreso por Sector',
              searchPlaceholder: 'Buscar sector...',
              loading: 'Cargando Progreso del Sector...',
              emptyTitle: 'Sin Datos de Sector',
              emptyDescription:
                'No hay sectores que coincidan con su búsqueda.',
              legend: {
                completed: 'Completado',
                remaining: 'Restante'
              },
              readings: 'Lecturas',
              pending: 'Pendientes',
              sector: 'Sector'
            },
            sectorStats: {
              title: 'Análisis de Sector',
              searchPlaceholder: 'Buscar...',
              loading: 'Cargando estadísticas del sector...',
              empty: 'No hay datos del sector disponibles.',
              columns: {
                sector: 'Sector',
                count: 'Cantidad',
                avgConsumption: 'Consumo Promedio',
                activeDays: 'Días Activos'
              }
            },
            tabs: {
              visual: 'Progreso Visual',
              detailed: 'Tabla Detallada',
              detailedReports: 'Reportes Detallados'
            },
            advancedReadings: {
              title: 'Rendimiento Diario',
              searchPlaceholder: 'Buscar...',
              loading: 'Cargando lecturas avanzadas...',
              empty: 'No hay lecturas avanzadas disponibles.',
              columns: {
                sector: 'Sector',
                totalConnections: 'Conexiones Totales',
                readingsCompleted: 'Lecturas Completadas',
                missingReadings: 'Lecturas Faltantes',
                progress: 'Porcentaje de Progreso'
              }
            }
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
          },
          common: {
            pagination: {
              page: 'Página {{current}} de {{total}}'
            }
          }
        }
      }
    },
    // fallbackLng uses 'es' if language detection fails or if a key is missing
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
