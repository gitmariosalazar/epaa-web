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

import UnAuthorizedPage from '@/shared/presentation/components/unauthorized/UnAuthorizedPage';
import { CircularProgress } from './shared/presentation/components/CircularProgress';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />; // TODO: Replace with nice loader
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

  if (isLoading) return <CircularProgress />;

  // Aseguramos que sea un array de strings y filtramos valores nulos
  const rawRoles = Array.isArray(user?.roles) ? user?.roles : [user?.roles];
  const userRoles = rawRoles.filter(Boolean) as string[];

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer />
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
                {/* Add other protected routes here */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
