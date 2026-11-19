import { Suspense, lazy, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import {
  AuthProvider,
  useAuth
} from '@/shared/presentation/context/AuthContext';
import { ThemeProvider } from '@/shared/presentation/context/ThemeContext';
import { LoginPage } from '@/modules/auth/presentation/pages/auth/LoginPage';
import { DashboardLayout } from '@/shared/presentation/components/Layout/DashboardLayout';
import { PermissionsProvider } from '@/modules/permissions/presentation/context/PermissionsContext';
import { UsersProvider } from '@/modules/users/presentation/context/UsersContext';
import './index.css';
import { RolesProvider } from '@/modules/roles/presentation/context/RolesContext';
import { ConnectionProvider } from '@/modules/connections/service-connections/presentation/context/ConnectionContext';
import { ReadingsProvider } from '@/modules/readings/presentation/context/ReadingsContext';
import { PaymentsProvider } from '@/modules/accounting/presentation/context/payments/PaymentsContext';
import { EntryDataProvider } from '@/modules/accounting/presentation/context/entry-data/EntryDataContext';
import { TrashRateReportProvider } from './modules/trash/presentation/context/TrashRateReportContext';
import { GetPropertyContextProvider } from '@/modules/properties/presentation/context/GetPropertiesContext';
import { GeneralCollectionProvider } from '@/modules/accounting/presentation/context/general-collection/GeneralCollectionContext';
import { AgreementsProvider } from '@/modules/accounting/presentation/context/agreements/AgreementsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VersionChecker } from '@/shared/presentation/components/VersionChecker/VersionChecker';
import { TramitesProvider } from '@/modules/tramites/presentation/context/TramitesContext';
import { SolicitudesProvider } from '@/modules/processes/solicitudes/presentation/context/SolicitudesContext';
import { NetworkOperationsProvider } from '@/modules/network-operations/presentation/context/NetworkOperationsContext';
import { IncidentProvider } from '@/modules/incidents/presentation/context/IncidentContext';
import { CircularProgress } from './shared/presentation/components/CircularProgress';
import type { RolOrPermission } from './shared/utils/interfaces/RolOrPermission';
import { RequireElevatedToken } from './modules/auth/presentation/components/RequireElevatedToken';
import { ReadingRoutesProvider } from '@/modules/reading-routes/presentation/context/ReadingRoutesContext';
import { lazyNamed } from '@/shared/utils/lazyNamed';

// ── Lazy-loaded Pages (Code Splitting by Domain Module — SRP & OCP) ───────────
const UnAuthorizedPage = lazy(
  () => import('@/shared/presentation/components/unauthorized/UnAuthorizedPage')
);

// Dashboard & Reports
const DashboardHome = lazyNamed(
  () =>
    import('@/modules/dashboard/presentation/pages/dashboard/DashboardHome'),
  'DashboardHome'
);
const ReportsPage = lazyNamed(
  () => import('@/modules/dashboard/presentation/pages/reports/ReportsPage'),
  'ReportsPage'
);

// Users, Roles, Permissions, Audit & Settings
const UsersPage = lazyNamed(
  () => import('@/modules/users/presentation/pages/users/UsersPage'),
  'UsersPage'
);
const UserDetailPage = lazyNamed(
  () => import('@/modules/users/presentation/pages/users/UserDetailPage'),
  'UserDetailPage'
);
const ProfilePage = lazyNamed(
  () => import('@/modules/users/presentation/pages/profile/ProfilePage'),
  'ProfilePage'
);
const RolesPage = lazyNamed(
  () => import('@/modules/roles/presentation/pages/roles/RolesPage'),
  'RolesPage'
);
const PositionsPage = lazyNamed(
  () => import('@/modules/roles/presentation/pages/positions/PositionsPage'),
  'PositionsPage'
);
const PermissionsPage = lazyNamed(
  () =>
    import('@/modules/permissions/presentation/pages/permissions/PermissionsPage'),
  'PermissionsPage'
);
const AuditPage = lazyNamed(
  () => import('@/modules/audit/presentation/pages/AuditPage'),
  'AuditPage'
);
const SettingsPage = lazyNamed(
  () => import('@/shared/presentation/pages/settings/SettingsPage'),
  'SettingsPage'
);

// Customers Module
const CustomersLayout = lazyNamed(
  () => import('@/modules/customers/presentation/pages'),
  'CustomersLayout'
);
const NaturalPersonsPage = lazyNamed(
  () => import('@/modules/customers/presentation/pages'),
  'NaturalPersonsPage'
);
const CompaniesPage = lazyNamed(
  () => import('@/modules/customers/presentation/pages'),
  'CompaniesPage'
);
const GeneralCustomersPage = lazyNamed(
  () => import('@/modules/customers/presentation/pages'),
  'GeneralCustomersPage'
);

// Connections Module
const ConnectionsPage = lazyNamed(
  () =>
    import('@/modules/connections/service-connections/presentation/pages/ConnectionsPage'),
  'ConnectionsPage'
);
const ConnectionsDashboardPage = lazyNamed(
  () =>
    import('@/modules/connections/service-connections/presentation/pages/ConnectionsDashboardPage/ConnectionsDashboardPage'),
  'ConnectionsDashboardPage'
);

// Accounting Module
const PaymentsPage = lazyNamed(
  () => import('@/modules/accounting/presentation/pages/payments/PaymentsPage'),
  'PaymentsPage'
);
const EntryDataPage = lazyNamed(
  () =>
    import('@/modules/accounting/presentation/pages/entry-data/EntryDataPage'),
  'EntryDataPage'
);
const OverduePaymentsPage = lazyNamed(
  () =>
    import('./modules/accounting/presentation/pages/overdue/OverduePaymentsPage'),
  'OverduePaymentsPage'
);
const GeneralCollectionPage = lazyNamed(
  () =>
    import('@/modules/accounting/presentation/pages/general-collection/GeneralCollectionPage'),
  'GeneralCollectionPage'
);
const AgreementsPage = lazyNamed(
  () =>
    import('@/modules/accounting/presentation/pages/agreements/AgreementsPage'),
  'AgreementsPage'
);
const PendingBillsPage = lazyNamed(
  () =>
    import('@/modules/accounting/presentation/pages/pending-bills/PendingBillsPage'),
  'PendingBillsPage'
);

// Readings & Reading Routes Module
const CreateReadingPage = lazyNamed(
  () => import('@/modules/readings/presentation/pages/CreateReadingPage'),
  'CreateReadingPage'
);
const CreateHistoricalReadingPage = lazyNamed(
  () =>
    import('@/modules/readings/presentation/pages/CreateHistoricalReadingPage'),
  'CreateHistoricalReadingPage'
);
const ReadingsListPage = lazyNamed(
  () => import('@/modules/readings/presentation/pages/ReadingsListPage'),
  'ReadingsListPage'
);
const ReadingAuditPage = lazyNamed(
  () => import('@/modules/readings/presentation/pages/ReadingAuditPage'),
  'ReadingAuditPage'
);
const ReadingImagesPage = lazyNamed(
  () => import('@/modules/readings/presentation/pages/ReadingImagesPage'),
  'ReadingImagesPage'
);
const UpdateReadingPage = lazyNamed(
  () => import('./modules/readings/presentation/pages/UpdateReadingPage'),
  'UpdateReadingPage'
);
const ReadingReports = lazyNamed(
  () => import('./modules/readings/presentation/pages/ReadingReports'),
  'ReadingReports'
);
const ReadingsWithErrors = lazyNamed(
  () => import('./modules/readings/presentation/pages/ReadingsWithErrors'),
  'ReadingsWithErrors'
);
const UpdateSpecialReadingPage = lazyNamed(
  () =>
    import('./modules/readings/presentation/pages/UpdateSpecialReadingPage'),
  'UpdateSpecialReadingPage'
);
const ReadingsReconciliationPage = lazyNamed(
  () => import('./modules/readings/presentation/pages'),
  'ReadingsReconciliationPage'
);
const ReadingsAnalyticsPage = lazyNamed(
  () => import('./modules/readings/presentation/pages'),
  'ReadingsAnalyticsPage'
);
const ReadingsDashboardPage = lazyNamed(
  () => import('./modules/readings/presentation/pages/ReadingsDashboardPage'),
  'ReadingsDashboardPage'
);
const ReadingRoutesPage = lazyNamed(
  () =>
    import('@/modules/reading-routes/presentation/pages/ReadingRoutesPage/ReadingRoutesPage'),
  'ReadingRoutesPage'
);

// Trash Rate & Properties Modules
const TrashRateReportPage = lazyNamed(
  () => import('./modules/trash/presentation/pages/TrashRateReportPage'),
  'TrashRateReportPage'
);
const TrashRateKPIPage = lazyNamed(
  () => import('./modules/trash/presentation/pages/TrashRateKPIPage'),
  'TrashRateKPIPage'
);
const PropertiesPage = lazyNamed(
  () => import('@/modules/properties/presentation/pages/PropertiesPage'),
  'PropertiesPage'
);

// Notifications Module
const NotificationsPage = lazyNamed(
  () => import('@/modules/notifications/presentation/pages/NotificationsPage'),
  'NotificationsPage'
);

// Tramites, Procedures & Solicitudes Modules
const TramitesCatalogPage = lazyNamed(
  () => import('@/modules/tramites/presentation/pages/TramitesCatalogPage'),
  'TramitesCatalogPage'
);
const TramiteDetailPage = lazyNamed(
  () => import('@/modules/tramites/presentation/pages/TramiteDetailPage'),
  'TramiteDetailPage'
);
const CambioTitularPage = lazyNamed(
  () =>
    import('@/modules/processes/cambio-titular/presentation/pages/CambioTitularPage'),
  'CambioTitularPage'
);
const SuspensionPage = lazyNamed(
  () =>
    import('@/modules/processes/suspension/presentation/pages/SuspensionPage'),
  'SuspensionPage'
);
const BeneficioTerceraEdadPage = lazyNamed(
  () =>
    import('@/modules/processes/beneficio-tercera-edad/presentation/pages/BeneficioTerceraEdadPage'),
  'BeneficioTerceraEdadPage'
);
const BeneficioDiscapacidadPage = lazyNamed(
  () =>
    import('@/modules/processes/beneficio-discapacidad/presentation/pages/BeneficioDiscapacidadPage'),
  'BeneficioDiscapacidadPage'
);
const SolicitudNuevaPage = lazyNamed(
  () =>
    import('@/modules/processes/solicitudes/presentation/pages/SolicitudNuevaPage'),
  'SolicitudNuevaPage'
);
const SolicitudesTrackingPage = lazyNamed(
  () =>
    import('@/modules/processes/solicitudes/presentation/pages/SolicitudesTrackingPage'),
  'SolicitudesTrackingPage'
);
const SolicitudesListPage = lazyNamed(
  () =>
    import('@/modules/processes/solicitudes/presentation/pages/SolicitudesListPage'),
  'SolicitudesListPage'
);
const SolicitudDetailPage = lazyNamed(
  () =>
    import('@/modules/processes/solicitudes/presentation/pages/SolicitudDetailPage'),
  'SolicitudDetailPage'
);

// Work Orders Module
const WorkOrdersProcessPage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'WorkOrdersProcessPage'
);
const WorkOrderCreatePage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'WorkOrderCreatePage'
);
const AllWorkOrdersListPage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'AllWorkOrdersListPage'
);
const WorkOrderDetailPage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'WorkOrderDetailPage'
);
const WorkOrderSearchPage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'WorkOrderSearchPage'
);
const WorkOrdersDashboardPage = lazyNamed(
  () => import('@/modules/work-orders/presentation/pages'),
  'WorkOrdersDashboardPage'
);

// Network Operations (SCADA) Module
const ScadaDashboardPage = lazyNamed(
  () =>
    import('@/modules/network-operations/presentation/pages/ScadaDashboardPage/ScadaDashboardPage'),
  'ScadaDashboardPage'
);

// Incidents Module
const IncidentsPage = lazyNamed(
  () => import('@/modules/incidents/presentation/pages/IncidentsPage'),
  'IncidentsPage'
);
const IncidentDashboardPage = lazyNamed(
  () => import('@/modules/incidents/presentation/pages/IncidentDashboardPage'),
  'IncidentDashboardPage'
);
const CreateIncidentPage = lazyNamed(
  () => import('@/modules/incidents/presentation/pages/CreateIncidentPage'),
  'CreateIncidentPage'
);

const PageSuspenseFallback = () => (
  <div className="circular-progress">
    <CircularProgress />
  </div>
);

const ProtectedRoute = () => {
  const { token, user, isLoading, isVerifying, logout } = useAuth();

  // Validación robusta: verificar si el usuario tiene rol de externo/cliente
  const isExternal = useMemo(() => {
    if (!user) return false;

    // Imprimimos el usuario para depuración, como pediste
    //console.log('[ProtectedRoute] Usuario actual con token:', user);

    const rawRoles: RolOrPermission[] = user?.roles;
    return rawRoles.filter(Boolean).some((r) => {
      const roleName: string = r.name ? r.name : String(r);
      const upper = roleName.toUpperCase();
      return (
        upper === 'WEB_USUARIO' ||
        upper === 'CLIENTE' ||
        upper === 'EXTERNO' ||
        upper === 'USUARIO_EXTERNO' ||
        upper === 'USUARIO_APP' ||
        upper === 'ABONADO PORTAL WEB'
      );
    });
  }, [user]);

  // Ejecutamos logout inmediatamente si es externo (Clean Architecture: Controller level side effect)
  useEffect(() => {
    if (isExternal) {
      console.warn(
        'Acceso denegado: Usuario externo intentando acceder a la intranet.'
      );
      logout();
    }
  }, [isExternal, logout]);

  // Si estamos validando, o si descubrimos que es externo (y el logout está en curso), mostramos loader
  if (isLoading || isVerifying || isExternal) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * RoleGuard - SOLID (Single Responsibility & Open/Closed)
 * Protege rutas basadas en el rol del usuario sin acoplar la lógica al componente de la página.
 */
const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );

  // Aseguramos que sea un array de strings o de objetos y extraemos el nombre del rol normalizado
  const rawRoles = Array.isArray(user?.roles) ? user?.roles : [user?.roles];
  const userRoles = rawRoles.filter(Boolean).flatMap((r: unknown) => {
    const roleObj =
      typeof r === 'object' && r !== null ? (r as { name?: string }) : null;
    const name = roleObj?.name ? roleObj.name : String(r);
    const upper = name.toUpperCase();

    // Mapeamos 'SUPER ADMINISTRADOR' para compatibilidad
    if (upper === 'SUPER ADMINISTRADOR') {
      return ['SUPER ADMINISTRADOR', 'ADMINISTRADOR'];
    }
    return [upper];
  });

  const hasAccess = allowedRoles.some((role) =>
    userRoles.includes(role.toUpperCase())
  );

  console.log('hasAccess', hasAccess);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <VersionChecker />
        <UsersProvider>
          <BrowserRouter>
            <Suspense fallback={<PageSuspenseFallback />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnAuthorizedPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/reports" element={<ReportsPage />} />

                    {/* Ejemplo de protección por Rol: Solo ADMIN puede ver usuarios */}
                    <Route
                      element={
                        <RoleGuard
                          allowedRoles={[
                            'SUPER ADMINISTRADOR',
                            'ADMINISTRADOR'
                          ]}
                        />
                      }
                    >
                      <Route
                        path="/users/*"
                        element={
                          <Routes>
                            <Route index element={<UsersPage />} />
                            <Route
                              path=":username"
                              element={<UserDetailPage />}
                            />
                          </Routes>
                        }
                      />
                    </Route>

                    <Route path="/customers" element={<CustomersLayout />}>
                      <Route
                        index
                        element={<Navigate to="natural-persons" replace />}
                      />
                      <Route
                        path="natural-persons"
                        element={<NaturalPersonsPage />}
                      />
                      <Route path="companies" element={<CompaniesPage />} />
                      <Route
                        path="general"
                        element={<GeneralCustomersPage />}
                      />
                    </Route>
                    <Route
                      path="/connections/*"
                      element={
                        <ConnectionProvider>
                          <Routes>
                            <Route
                              index
                              element={<Navigate to="list" replace />}
                            />
                            <Route path="list" element={<ConnectionsPage />} />
                            <Route path="map" element={<ConnectionsPage />} />
                            <Route
                              path="dashboard"
                              element={<ConnectionsDashboardPage />}
                            />
                          </Routes>
                        </ConnectionProvider>
                      }
                    />
                    <Route
                      path="/network-operations/*"
                      element={
                        <NetworkOperationsProvider>
                          <Routes>
                            <Route
                              path="scada"
                              element={<ScadaDashboardPage />}
                            />
                          </Routes>
                        </NetworkOperationsProvider>
                      }
                    />
                    <Route
                      path="/roles"
                      element={
                        <RolesProvider>
                          <RolesPage />
                        </RolesProvider>
                      }
                    />
                    <Route path="/positions" element={<PositionsPage />} />
                    <Route
                      path="/permissions"
                      element={
                        <PermissionsProvider>
                          <PermissionsPage />
                        </PermissionsProvider>
                      }
                    />
                    <Route path="/audit" element={<AuditPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route
                      path="/accounting"
                      element={
                        <PaymentsProvider>
                          <PaymentsPage />
                        </PaymentsProvider>
                      }
                    />
                    <Route
                      path="/accounting/entry-data"
                      element={
                        <EntryDataProvider>
                          <EntryDataPage />
                        </EntryDataProvider>
                      }
                    />
                    <Route
                      path="/accounting/overdue"
                      element={
                        <PaymentsProvider>
                          <OverduePaymentsPage />
                        </PaymentsProvider>
                      }
                    />
                    <Route
                      path="/accounting/general-collection"
                      element={
                        <GeneralCollectionProvider>
                          <GeneralCollectionPage />
                        </GeneralCollectionProvider>
                      }
                    />
                    <Route
                      path="/accounting/agreements"
                      element={
                        <AgreementsProvider>
                          <AgreementsPage />
                        </AgreementsProvider>
                      }
                    />
                    <Route
                      path="/accounting/payment-receipts"
                      element={
                        <PaymentsProvider>
                          <PendingBillsPage />
                        </PaymentsProvider>
                      }
                    />
                    <Route
                      path="/readings/*"
                      element={
                        <ReadingsProvider>
                          <Routes>
                            <Route path="add" element={<CreateReadingPage />} />
                            <Route path="list" element={<ReadingsListPage />} />
                            <Route
                              path="images"
                              element={<ReadingImagesPage />}
                            />
                            <Route
                              path="update"
                              element={<UpdateReadingPage />}
                            />
                            <Route
                              path="audit"
                              element={<ReadingAuditPage />}
                            />
                            <Route path="report" element={<ReadingReports />} />
                            <Route
                              path="dashboard"
                              element={<ReadingsDashboardPage />}
                            />
                            <Route
                              path="analytics"
                              element={<ReadingsAnalyticsPage />}
                            />
                            <Route
                              path="report-errors"
                              element={
                                <RequireElevatedToken fallbackMessage="El acceso a los Errores de Lectura requiere un nivel de autorización especial. Ingresa tu PIN de seguridad.">
                                  <ReadingsWithErrors />
                                </RequireElevatedToken>
                              }
                            />
                            <Route
                              path="advanced-update"
                              element={
                                <RequireElevatedToken fallbackMessage="La actualización avanzada de lecturas requiere un nivel de autorización especial. Ingresa tu PIN de seguridad.">
                                  <UpdateSpecialReadingPage />
                                </RequireElevatedToken>
                              }
                            />
                            <Route
                              path="reconciliation"
                              element={
                                <RequireElevatedToken fallbackMessage="La sincronización de lecturas requiere un nivel de autorización especial. Ingresa tu PIN de seguridad.">
                                  <ReadingsReconciliationPage />
                                </RequireElevatedToken>
                              }
                            />
                            <Route
                              path="reading-images"
                              element={
                                <RequireElevatedToken fallbackMessage="La visualización de imágenes requiere un nivel de autorización especial. Ingresa tu PIN de seguridad.">
                                  <ReadingImagesPage isPublic={false} />
                                </RequireElevatedToken>
                              }
                            />
                            <Route
                              path="add-historical"
                              element={
                                <RequireElevatedToken fallbackMessage="La adición de lecturas históricas requiere un nivel de autorización especial. Ingresa tu PIN de seguridad.">
                                  <CreateHistoricalReadingPage />
                                </RequireElevatedToken>
                              }
                            />

                            {/* Other reading routes can be added here */}
                            <Route
                              path="routes"
                              element={
                                <ReadingRoutesProvider>
                                  <ReadingRoutesPage />
                                </ReadingRoutesProvider>
                              }
                            />
                          </Routes>
                        </ReadingsProvider>
                      }
                    />
                    <Route
                      path="/reading-routes/*"
                      element={
                        <ReadingRoutesProvider>
                          <ReadingRoutesPage />
                        </ReadingRoutesProvider>
                      }
                    />
                    <Route
                      path="/incidents/*"
                      element={
                        <ConnectionProvider>
                          <IncidentProvider>
                            <Routes>
                              {/* Ruta raíz → lista */}
                              <Route index element={<IncidentsPage />} />
                              {/* Tab: Lista e Incidentes (comparten IncidentsPage, el tab se sincroniza por pathname) */}
                              <Route path="list" element={<IncidentsPage />} />
                              <Route path="map" element={<IncidentsPage />} />
                              <Route
                                path="dashboard"
                                element={<IncidentDashboardPage />}
                              />
                              {/* Crear incidente (flujo separado) */}
                              <Route
                                path="create"
                                element={
                                  <ReadingsProvider>
                                    <CreateIncidentPage />
                                  </ReadingsProvider>
                                }
                              />
                            </Routes>
                          </IncidentProvider>
                        </ConnectionProvider>
                      }
                    />
                    <Route
                      path="/trash-rate/*"
                      element={
                        <TrashRateReportProvider>
                          <Routes>
                            <Route
                              path="trash-report-audit"
                              element={<TrashRateReportPage />}
                            />
                            <Route
                              path="trash-rate-kpi"
                              element={<TrashRateKPIPage />}
                            />
                            {/* Add more trash-rate sub-routes here */}
                          </Routes>
                        </TrashRateReportProvider>
                      }
                    />
                    <Route
                      path="/properties/*"
                      element={
                        <GetPropertyContextProvider>
                          <Routes>
                            <Route path="list" element={<PropertiesPage />} />
                          </Routes>
                        </GetPropertyContextProvider>
                      }
                    />

                    {/* Módulo de Notificaciones */}
                    <Route
                      path="/notifications"
                      element={<NotificationsPage />}
                    />

                    {/* Módulo de Órdenes de Trabajo */}
                    <Route
                      path="/work-orders/dashboard"
                      element={<WorkOrdersDashboardPage />}
                    />
                    <Route
                      path="/work-orders/list"
                      element={<AllWorkOrdersListPage />}
                    />
                    <Route
                      path="/work-orders/search"
                      element={<WorkOrderSearchPage />}
                    />
                    <Route
                      path="/work-orders/process"
                      element={<WorkOrdersProcessPage />}
                    />
                    <Route
                      path="/work-orders/new"
                      element={<WorkOrderCreatePage />}
                    />
                    <Route
                      path="/work-orders/create"
                      element={<WorkOrderCreatePage />}
                    />
                    {/* Detalle de OT — ruta dinámica SIEMPRE después de las estáticas */}
                    <Route
                      path="/work-orders/:codigoOrden"
                      element={<WorkOrderDetailPage />}
                    />

                    {/* Módulo de Trámites */}
                    <Route
                      path="/tramites/*"
                      element={
                        <TramitesProvider>
                          <Routes>
                            <Route index element={<TramitesCatalogPage />} />
                            <Route path=":id" element={<TramiteDetailPage />} />
                          </Routes>
                        </TramitesProvider>
                      }
                    />

                    {/* Módulo de Requisitos por Trámite (Procedures) */}
                    <Route
                      path="/procedures/cambio-titular"
                      element={<CambioTitularPage />}
                    />
                    <Route
                      path="/procedures/suspension"
                      element={<SuspensionPage />}
                    />
                    <Route
                      path="/procedures/tercera-edad"
                      element={<BeneficioTerceraEdadPage />}
                    />
                    <Route
                      path="/procedures/discapacidad"
                      element={<BeneficioDiscapacidadPage />}
                    />
                    <Route
                      path="/procedures/acometidas"
                      element={<Navigate to="/tramites" replace />}
                    />

                    {/* Módulo de Solicitudes (Requests) */}
                    <Route
                      path="/requests/*"
                      element={
                        <SolicitudesProvider>
                          <TramitesProvider>
                            <Routes>
                              <Route
                                path=":categoria/new"
                                element={<SolicitudNuevaPage />}
                              />
                              <Route
                                path=":categoria/tracking"
                                element={<SolicitudesTrackingPage />}
                              />
                              <Route
                                path=":categoria/list"
                                element={<SolicitudesListPage />}
                              />
                              <Route
                                path=":categoria/pending"
                                element={
                                  <SolicitudesListPage filter="en_proceso" />
                                }
                              />
                              <Route
                                path=":categoria/approved"
                                element={
                                  <SolicitudesListPage filter="aprobada" />
                                }
                              />
                              <Route
                                path=":categoria/rejected"
                                element={
                                  <SolicitudesListPage filter="rechazada" />
                                }
                              />
                            </Routes>
                          </TramitesProvider>
                        </SolicitudesProvider>
                      }
                    />

                    {/* Rutas adicionales de Solicitudes (Detalles y compatibilidad) */}
                    <Route
                      path="/solicitudes/*"
                      element={
                        <SolicitudesProvider>
                          <TramitesProvider>
                            <Routes>
                              <Route
                                index
                                element={<Navigate to="/tramites" replace />}
                              />
                              <Route
                                path="nueva"
                                element={<SolicitudNuevaPage />}
                              />
                              <Route
                                path="nueva/:tramiteId"
                                element={<SolicitudNuevaPage />}
                              />
                              <Route
                                path=":id"
                                element={<SolicitudDetailPage />}
                              />
                            </Routes>
                          </TramitesProvider>
                        </SolicitudesProvider>
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </UsersProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
