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
import { DashboardHome } from '@/modules/dashboard/presentation/pages/dashboard/DashboardHome';
import { UsersPage } from '@/modules/users/presentation/pages/users/UsersPage';
import {
  CustomersLayout,
  NaturalPersonsPage,
  CompaniesPage,
  GeneralCustomersPage
} from '@/modules/customers/presentation/pages';
import { UserDetailPage } from '@/modules/users/presentation/pages/users/UserDetailPage';
import { RolesPage } from '@/modules/roles/presentation/pages/roles/RolesPage';
import { ConnectionsPage } from '@/modules/connections/presentation/pages/ConnectionsPage';
import { ConnectionsDashboardPage } from '@/modules/connections/presentation/pages/ConnectionsDashboardPage/ConnectionsDashboardPage';
import { PermissionsPage } from '@/modules/permissions/presentation/pages/permissions/PermissionsPage';
import { PermissionsProvider } from '@/modules/permissions/presentation/context/PermissionsContext';
import { AuditPage } from '@/modules/audit/presentation/pages/AuditPage';
import { ProfilePage } from '@/modules/users/presentation/pages/profile/ProfilePage';
import { UsersProvider } from '@/modules/users/presentation/context/UsersContext';
import { SettingsPage } from '@/shared/presentation/pages/settings/SettingsPage';
import { ReportsPage } from '@/modules/dashboard/presentation/pages/reports/ReportsPage';
import './index.css';
import { RolesProvider } from '@/modules/roles/presentation/context/RolesContext';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ReadingsProvider } from '@/modules/readings/presentation/context/ReadingsContext';
import { CreateReadingPage } from '@/modules/readings/presentation/pages/CreateReadingPage';
import { PaymentsProvider } from '@/modules/accounting/presentation/context/payments/PaymentsContext';
import { PaymentsPage } from '@/modules/accounting/presentation/pages/payments/PaymentsPage';
import { EntryDataProvider } from '@/modules/accounting/presentation/context/entry-data/EntryDataContext';
import { EntryDataPage } from '@/modules/accounting/presentation/pages/entry-data/EntryDataPage';
import { ReadingsListPage } from '@/modules/readings/presentation/pages/ReadingsListPage';
import { ReadingAuditPage } from '@/modules/readings/presentation/pages/ReadingAuditPage';
import { ReadingImagesPage } from '@/modules/readings/presentation/pages/ReadingImagesPage';
import { TrashRateReportProvider } from './modules/trash/presentation/context/TrashRateReportContext';
import { TrashRateReportPage } from './modules/trash/presentation/pages/TrashRateReportPage';
import { TrashRateKPIPage } from './modules/trash/presentation/pages/TrashRateKPIPage';
import { UpdateReadingPage } from './modules/readings/presentation/pages/UpdateReadingPage';
import { GetPropertyContextProvider } from '@/modules/properties/presentation/context/GetPropertiesContext';
import { PropertiesPage } from '@/modules/properties/presentation/pages/PropertiesPage';
import { OverduePaymentsPage } from './modules/accounting/presentation/pages/overdue/OverduePaymentsPage';
import { GeneralCollectionProvider } from '@/modules/accounting/presentation/context/general-collection/GeneralCollectionContext';
import { GeneralCollectionPage } from '@/modules/accounting/presentation/pages/general-collection/GeneralCollectionPage';
import { AgreementsProvider } from '@/modules/accounting/presentation/context/agreements/AgreementsContext';
import { AgreementsPage } from '@/modules/accounting/presentation/pages/agreements/AgreementsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Notifications Module
import { NotificationsPage } from '@/modules/notifications/presentation/pages/NotificationsPage';

// Tramites Module
import { TramitesProvider } from '@/modules/tramites/presentation/context/TramitesContext';
import { TramitesCatalogPage } from '@/modules/tramites/presentation/pages/TramitesCatalogPage';
import { TramiteDetailPage } from '@/modules/tramites/presentation/pages/TramiteDetailPage';

// Procedures Requirements Pages
import { CambioTitularPage } from '@/modules/processes/cambio-titular/presentation/pages/CambioTitularPage';
import { SuspensionPage } from '@/modules/processes/suspension/presentation/pages/SuspensionPage';
import { BeneficioTerceraEdadPage } from '@/modules/processes/beneficio-tercera-edad/presentation/pages/BeneficioTerceraEdadPage';
import { BeneficioDiscapacidadPage } from '@/modules/processes/beneficio-discapacidad/presentation/pages/BeneficioDiscapacidadPage';

// Solicitudes Module
import { SolicitudesProvider } from '@/modules/processes/solicitudes/presentation/context/SolicitudesContext';
import { SolicitudNuevaPage } from '@/modules/processes/solicitudes/presentation/pages/SolicitudNuevaPage';
import { SolicitudesTrackingPage } from '@/modules/processes/solicitudes/presentation/pages/SolicitudesTrackingPage';
import { SolicitudesListPage } from '@/modules/processes/solicitudes/presentation/pages/SolicitudesListPage';
import { SolicitudDetailPage } from '@/modules/processes/solicitudes/presentation/pages/SolicitudDetailPage';
import { WorkOrdersProcessPage, WorkOrderCreatePage, AllWorkOrdersListPage, WorkOrderDetailPage } from '@/modules/work-orders/presentation/pages';

// Incidents Module
import { IncidentProvider } from '@/modules/incidents/presentation/context/IncidentContext';
import { IncidentsListPage } from '@/modules/incidents/presentation/pages/IncidentsListPage';
import { CreateIncidentPage } from '@/modules/incidents/presentation/pages/CreateIncidentPage';

import UnAuthorizedPage from '@/shared/presentation/components/unauthorized/UnAuthorizedPage';
import { CircularProgress } from './shared/presentation/components/CircularProgress';

const ProtectedRoute = () => {
  const { token, isLoading, isVerifying } = useAuth();

  // Wait for both: local session hydration AND backend verify call
  if (isLoading || isVerifying) {
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
  const userRoles = rawRoles.filter(Boolean).flatMap((r: any) => {
    const name = typeof r === 'object' && r.name ? r.name : String(r);
    const upper = name.toUpperCase();
    // Mapeamos 'ADMINISTRADOR' a 'ADMIN' para compatibilidad con allowedRoles={['ADMIN']}
    if (upper === 'ADMINISTRADOR' || upper === 'ADMIN') {
      return ['ADMIN', 'ADMINISTRADOR'];
    }
    return [upper];
  });

  const hasAccess = allowedRoles.some((role) =>
    userRoles.includes(role.toUpperCase())
  );

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
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnAuthorizedPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/reports" element={<ReportsPage />} />

                {/* Ejemplo de protección por Rol: Solo ADMIN puede ver usuarios */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                  <Route
                    path="/users/*"
                    element={
                      <UsersProvider>
                        <Routes>
                          <Route index element={<UsersPage />} />
                          <Route
                            path=":username"
                            element={<UserDetailPage />}
                          />
                        </Routes>
                      </UsersProvider>
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
                  <Route path="general" element={<GeneralCustomersPage />} />
                </Route>
                <Route
                  path="/connections/*"
                  element={
                    <ConnectionProvider>
                      <Routes>
                        <Route index element={<Navigate to="list" replace />} />
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
                  path="/roles"
                  element={
                    <RolesProvider>
                      <RolesPage />
                    </RolesProvider>
                  }
                />
                <Route
                  path="/permissions"
                  element={
                    <PermissionsProvider>
                      <PermissionsPage />
                    </PermissionsProvider>
                  }
                />
                <Route path="/audit" element={<AuditPage />} />
                <Route
                  path="/profile"
                  element={
                    <UsersProvider>
                      <ProfilePage />
                    </UsersProvider>
                  }
                />
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
                  path="/readings/*"
                  element={
                    <ReadingsProvider>
                      <Routes>
                        <Route path="add" element={<CreateReadingPage />} />
                        <Route path="list" element={<ReadingsListPage />} />
                        <Route path="images" element={<ReadingImagesPage />} />
                        <Route path="update" element={<UpdateReadingPage />} />
                        <Route path="audit" element={<ReadingAuditPage />} />
                        {/* Other reading routes can be added here */}
                      </Routes>
                    </ReadingsProvider>
                  }
                />
                <Route
                  path="/incidents/*"
                  element={
                    <IncidentProvider>
                      <Routes>
                        <Route index element={<IncidentsListPage />} />
                        <Route path="list" element={<IncidentsListPage />} />
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
                <Route path="/notifications" element={<NotificationsPage />} />

                {/* Módulo de Órdenes de Trabajo */}
                <Route
                  path="/work-orders/list"
                  element={<AllWorkOrdersListPage />}
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
                            element={<SolicitudesListPage filter="aprobada" />}
                          />
                          <Route
                            path=":categoria/rejected"
                            element={<SolicitudesListPage filter="rechazada" />}
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
                          <Route path=":id" element={<SolicitudDetailPage />} />
                        </Routes>
                      </TramitesProvider>
                    </SolicitudesProvider>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
