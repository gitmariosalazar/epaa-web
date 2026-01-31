import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import type { User } from '@/modules/users/domain/models/User';
import { EditProfileModal } from '@/shared/presentation/components/Modal/EditProfileModal';
import { ChangePasswordModal } from '@/shared/presentation/components/Modal/ChangePasswordModal';
import { UpdateUserUseCase } from '@/modules/users/application/usecases/UpdateUserUseCase';
import { ChangePasswordUseCase } from '@/modules/users/application/usecases/ChangePasswordUseCase';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Activity,
  AlertTriangle,
  Edit2,
  Lock,
  ArrowLeft,
  Loader
} from 'lucide-react';
import '../profile/Profile.css'; // Reusing profile styles
import { Button } from '@/shared/presentation/components/Button/Button';
import { GetProfileUseCase } from '@/modules/users/application/usecases/GetProfileUseCase';
import { MdAdd, MdDeleteForever, MdLockOpen } from 'react-icons/md';
import { CheckBox } from '@/shared/presentation/components/Input/CheckBox';
import '@/shared/presentation/styles/UserDetailPage.css';

// Mock component for roles table (will be implemented fully later)
const UserRolesTable = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for roles to handle UI toggles immediately
  const [localRoles, setLocalRoles] = useState<any[]>([]);

  const userRepository = useMemo(() => new UserRepositoryImpl(), []);

  const fetchUser = async () => {
    if (!user?.username) return;

    try {
      setLoading(true);
      const useCase = new GetProfileUseCase(userRepository);
      const userData = await useCase.execute(user.username);
      // Initialize local roles with an extra 'active' property for the table demo
      // In a real app, 'active' might come from the backend or be implied by presence in the list
      if (userData?.roles) {
        setLocalRoles(
          userData.roles.map((r) => ({
            ...(typeof r === 'string' ? { id: r, name: r } : r),
            active: true // Default to true since they are assigned
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user.username]);

  const toggleRoleStatus = (roleId: string | number) => {
    setLocalRoles((prev) =>
      prev.map((role) =>
        role.id === roleId || role.name === roleId
          ? { ...role, active: !role.active }
          : role
      )
    );
  };

  const handleSaveChanges = () => {
    // Here only enabled roles would be sent to the backend
    const activeRoles = localRoles.filter((r) => r.active);
    console.log('Saving roles:', activeRoles);
    alert(
      `Changes saved! Active roles: ${activeRoles.map((r) => r.name).join(', ')}`
    );
  };

  if (loading) {
    return (
      <div
        className="profile-page__container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'var(--text-secondary)'
        }}
      >
        <Loader size={24} className="animate-spin" />
        <span style={{ marginLeft: '10px' }}>Loading roles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page__error-message">
        <AlertTriangle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-main)',
            margin: 0
          }}
        >
          <Shield size={20} className="text-accent" /> Assigned Roles &
          Permissions
        </h3>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<MdAdd size={16} />}
          onClick={() => alert('Open Add Role Modal')}
        >
          Assign New Role
        </Button>
      </div>

      <div
        className="table-responsive"
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <table
          className="table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr
              style={{
                background: 'var(--surface-hover)',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Role Name
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {localRoles.map((role) => (
              <tr
                key={role.id || role.name}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background 0.2s'
                }}
              >
                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--primary-light-10)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Shield size={16} />
                    </div>
                    <span
                      style={{ fontWeight: 500, color: 'var(--text-main)' }}
                    >
                      {role.name}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: '1rem',
                    verticalAlign: 'middle',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}
                >
                  {role.description || 'Access level permissions'}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                  }}
                >
                  <span
                    className={
                      role.active
                        ? 'profile-page__status-active'
                        : 'profile-page__status-inactive'
                    }
                  >
                    {role.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '8px'
                    }}
                  >
                    {/* Enable/Disable Toggle */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '1rem'
                      }}
                      title={role.active ? 'Disable Role' : 'Enable Role'}
                    >
                      <CheckBox
                        checked={role.active}
                        onCheckedChange={() =>
                          toggleRoleStatus(role.id || role.name)
                        }
                        name={`role-${role.id}`}
                        value={String(role.id)}
                        className="cursor-pointer"
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      title="Add Permission"
                      onClick={() =>
                        alert(`Add permission to role: ${role.name}`)
                      }
                      circle
                      style={{ color: 'var(--primary)' }}
                    >
                      <MdAdd size={18} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      title="View Permissions"
                      onClick={() => alert(`View permissions for ${role.name}`)}
                      circle
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <MdLockOpen size={18} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      title="Remove Role"
                      onClick={() => {
                        if (
                          confirm('Are you sure you want to remove this role?')
                        ) {
                          setLocalRoles((prev) =>
                            prev.filter((r) => r.id !== role.id)
                          );
                        }
                      }}
                      circle
                      style={{ color: 'var(--error)' }}
                    >
                      <MdDeleteForever size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {localRoles.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <Shield size={48} style={{ opacity: 0.2 }} />
                    <p>No roles assigned to this user.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}
      >
        <Button variant="ghost" onClick={fetchUser} disabled={loading}>
          Reset
        </Button>
        <Button
          leftIcon={<Shield size={16} />}
          onClick={handleSaveChanges}
          variant="primary"
          style={{ minWidth: '150px' }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export const UserDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const userRepository = useMemo(() => new UserRepositoryImpl(), []);

  const fetchUser = async () => {
    if (!username) return;

    try {
      setLoading(true);
      const useCase = new GetProfileUseCase(userRepository);
      const userData = await useCase.execute(username);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user', err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  const handleUpdateUser = async (data: UpdateUserRequest) => {
    if (!user || !username) return;
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    await updateUserUseCase.execute(username, data);
    await fetchUser();
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    if (!user || !username) return;
    const changePasswordUseCase = new ChangePasswordUseCase(userRepository);
    await changePasswordUseCase.execute(user.username, data);
    alert('Password changed successfully');
    await fetchUser();
  };

  if (loading) {
    return (
      <div
        className="profile-page__container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}
      >
        <div className="profile-page__loader">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page__container">
        <div className="profile-page__error-message">
          <AlertTriangle size={24} />
          <span>{error || 'User not found'}</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/users')}
          style={{ marginTop: '1rem' }}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="profile-page__container">
      <div className="profile-page__back-button">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/users')}
        >
          Back to Users
        </Button>
      </div>

      <div className="profile-page__header">
        <div className="profile-page__avatar-wrapper">
          <div className="profile-page__avatar">
            {user.firstName
              ? user.firstName.charAt(0).toUpperCase()
              : user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-page__info">
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <div className="profile-page__role-badge">
            <span
              style={{
                marginRight: '0.5rem',
                fontWeight: 'normal',
                opacity: 0.8
              }}
            >
              Username:
            </span>
            @{user.username}
          </div>
        </div>
        <div
          style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}
        >
          <button
            className="btn-secondary profile-page__header-btn"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 size={18} /> Edit User
          </button>
          <button
            className="btn-secondary profile-page__header-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Lock size={18} /> Reset Password
          </button>
        </div>
      </div>

      <div className="profile-page__grid">
        <div className="profile-page__card">
          <h2>
            <UserIcon size={24} strokeWidth={1.5} /> Personal Information
          </h2>

          <div className="profile-page__info-group">
            <label>Username</label>
            <div className="profile-page__info-value">
              <UserIcon size={16} />
              {user.username}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Email</label>
            <div className="profile-page__info-value">
              <Mail size={16} /> {user.email}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Registered At</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />{' '}
              {new Date(user.registeredAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="profile-page__card">
          <h2>
            <Activity size={24} strokeWidth={1.5} /> Account Status
          </h2>

          <div className="profile-page__info-group">
            <label>Status</label>
            <div
              className={`profile-page__info-value ${user.isActive ? 'profile-page__status-active' : 'profile-page__status-inactive'}`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Last Login</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : 'Last login not available'}
            </div>
          </div>
        </div>

        {/* Full width card for Roles */}
        <div className="profile-page__card full-width">
          <UserRolesTable user={user} />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        user={user}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
    </div>
  );
};
