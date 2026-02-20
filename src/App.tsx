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
import { PermissionsPage } from '@/modules/permissions/presentation/pages/permissions/PermissionsPage';
import { ProfilePage } from '@/modules/users/presentation/pages/profile/ProfilePage';
import { SettingsPage } from '@/shared/presentation/pages/settings/SettingsPage';
import { ReportsPage } from '@/modules/dashboard/presentation/pages/reports/ReportsPage';
import './index.css';
import { RolesProvider } from '@/modules/roles/presentation/context/RolesContext';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Replace with nice loader
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:username" element={<UserDetailPage />} />
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
                  path="/connections"
                  element={
                    <ConnectionProvider>
                      <ConnectionsPage />
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
                <Route path="/permissions" element={<PermissionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
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
