import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '@/modules/users/domain/models/User';
import { EditProfileModal } from '@/shared/presentation/components/Modal/EditProfileModal';
import { ChangePasswordModal } from '@/shared/presentation/components/Modal/ChangePasswordModal';
import { useUsersContext } from '../../context/UsersContext';
import { useUserDetailViewModel } from '../../hooks/useUserDetailViewModel';
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
  Loader,
  Unlock,
  X,
  Check,
  Key
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MdAdd, MdDeleteForever, MdLockOpen, MdSecurity } from 'react-icons/md';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import AddRoleModal from '../../components/AddRoleModal/AddRoleModal';
import { AddDirectPermissionModal } from '../../components/AddDirectPermissionModal/AddDirectPermissionModal';
import { RolePermissionModal } from '@/shared/presentation/components/Roles/RolePermissionModal';
import type { Role } from '@/modules/roles/domain/models/Role';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { ConverDateTimeToText } from '@/shared/utils/datetime/ConverDate';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaFileContract, FaUserShield } from 'react-icons/fa';
import type { RolOrPermission } from '@/shared/utils/interfaces/RolOrPermission';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import './UserDetailPage.css';

type LocalRole = RolOrPermission & { active: boolean };

const UserRolesTable = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localRoles, setLocalRoles] = useState<LocalRole[]>([]);
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] =
    useState<Role | null>(null);

  const {
    getProfileUseCase,
    assignRoleToUserUseCase,
    removeRoleFromUserUseCase
  } = useUsersContext();

  const fetchUser = useCallback(async () => {
    if (!user?.username) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await getProfileUseCase.execute(user.username);
      if (userData?.roles) {
        setLocalRoles(
          userData.roles.map((r: RolOrPermission) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            active: true
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch user roles', err);
      setError('Error al cargar los roles del usuario.');
    } finally {
      setLoading(false);
    }
  }, [user?.username, getProfileUseCase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAssignRole = async (roleId: number) => {
    if (!user?.userId) return;
    try {
      await assignRoleToUserUseCase.execute(user.userId, roleId);
      MessageToastCustom('success', 'Rol asignado correctamente', 'Éxito');
      setIsAssignRoleOpen(false);
      fetchUser();
    } catch (error: any) {
      console.error('Failed to assign role', error);
      const errorData = error?.response?.data;
      let errorMessage = 'Error al asignar el rol.';
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message[0]
          : errorData.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      MessageToastCustom('error', errorMessage, 'Error', {
        position: 'top-right'
      });
    }
  };

  const handleRemoveRole = async (roleId: number, roleName: string) => {
    if (!user?.userId) return;
    if (
      !confirm(
        `¿Está seguro de que desea revocar el rol "${roleName}" a este usuario?`
      )
    )
      return;

    try {
      await removeRoleFromUserUseCase.execute(user.userId, roleId);
      MessageToastCustom(
        'success',
        `Rol "${roleName}" revocado correctamente`,
        'Éxito'
      );
      fetchUser();
    } catch (err: unknown) {
      console.error('Error al revocar rol:', err);
      MessageToastCustom('error', 'Error al revocar el rol al usuario', 'Error');
    }
  };

  if (loading) {
    return (
      <div className="user-detail-loader-container" style={{ height: '140px' }}>
        <Loader size={20} className="animate-spin" />
        <span>Cargando roles asignados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-detail-error-container" style={{ margin: '1rem 0' }}>
        <div className="user-detail-error-icon">
          <AlertTriangle size={24} />
        </div>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="user-detail-table-card">
      <div className="user-detail-table-card__top">
        <div className="user-detail-table-card__title-row">
          <h3>
            <Shield size={20} color="var(--primary)" /> Roles Asignados
          </h3>
          <span className="user-detail-table-card__count-badge">
            {localRoles.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<MdAdd size={16} />}
          onClick={() => setIsAssignRoleOpen(true)}
        >
          Asignar Nuevo Rol
        </Button>
      </div>

      <div className="user-detail-table-wrap">
        <table className="user-detail-table">
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localRoles.map((role) => (
              <tr key={role.id || role.name}>
                <td>
                  <div className="user-detail-role-cell">
                    <div className="user-detail-role-icon">
                      <MdSecurity size={16} />
                    </div>
                    <span className="user-detail-role-name">
                      {role.name}
                    </span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {role.description || 'Nivel de acceso funcional'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="users-status-badge users-status-badge--active">
                    Asignado
                  </span>
                </td>
                <td>
                  <div className="user-detail-actions">
                    <Tooltip content="Ver Permisos del Rol" followCursor={false}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setSelectedRoleForPermissions({
                            rolId: Number(role.id),
                            name: role.name,
                            description: role.description || '',
                            isActive: true
                          } as Role)
                        }
                        circle
                        style={{ color: 'var(--primary)' }}
                      >
                        <MdLockOpen size={18} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Revocar Rol" followCursor={false}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveRole(Number(role.id), role.name)}
                        circle
                        className="user-detail-btn-danger"
                      >
                        <MdDeleteForever size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
            {localRoles.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="user-detail-table-empty">
                    <Shield size={40} style={{ opacity: 0.25 }} />
                    <p>No hay roles asignados a este usuario.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddRoleModal
        isOpen={isAssignRoleOpen}
        onClose={() => setIsAssignRoleOpen(false)}
        onSave={handleAssignRole}
        userSelected={user}
      />

      <RolePermissionModal
        isOpen={Boolean(selectedRoleForPermissions)}
        onClose={() => setSelectedRoleForPermissions(null)}
        role={selectedRoleForPermissions}
      />
    </div>
  );
};

// Componente para administrar los permisos directos / temporales del usuario
const UserDirectPermissionsTable = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(true);
  const [directPermissions, setDirectPermissions] = useState<
    { id: number; name: string; description?: string }[]
  >([]);
  const [isAssignPermOpen, setIsAssignPermOpen] = useState(false);

  const {
    getPermissionsByUserUseCase,
    assignPermissionToUserUseCase,
    removePermissionFromUserUseCase
  } = useUsersContext();
  const { user: currentUser, refreshSession } = useAuth();

  const fetchPermissions = useCallback(async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const data = await getPermissionsByUserUseCase.execute(user.userId);
      setDirectPermissions(data || []);
    } catch (err) {
      console.error('Failed to fetch user direct permissions', err);
    } finally {
      setLoading(false);
    }
  }, [user?.userId, getPermissionsByUserUseCase]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleAssignDirectPermission = async (
    permissionId: number,
    expirationDate?: string | null
  ) => {
    if (!user?.userId) return;
    try {
      await assignPermissionToUserUseCase.execute(
        user.userId,
        permissionId,
        expirationDate || undefined
      );
      MessageToastCustom(
        'success',
        expirationDate
          ? 'Permiso temporal asignado exitosamente'
          : 'Permiso permanente asignado exitosamente',
        'Éxito'
      );
      setIsAssignPermOpen(false);
      fetchPermissions();
      if (currentUser?.userId === user.userId) {
        await refreshSession().catch(() => {});
      }
    } catch (err: unknown) {
      console.error('Error assigning direct permission', err);
      MessageToastCustom('error', 'Error al asignar el permiso directo', 'Error');
      throw err;
    }
  };

  const handleAssignBatchDirectPermissions = async (
    items: Array<{ permissionId: number; expirationDate?: string | null }>
  ) => {
    if (!user?.userId || items.length === 0) return;
    try {
      await assignPermissionToUserUseCase.executeBatch(user.userId, items);
      MessageToastCustom(
        'success',
        `${items.length} permiso(s) asignado(s) exitosamente`,
        'Éxito'
      );
      setIsAssignPermOpen(false);
      fetchPermissions();
      if (currentUser?.userId === user.userId) {
        await refreshSession().catch(() => {});
      }
    } catch (err: unknown) {
      console.error('Error assigning batch direct permissions', err);
      MessageToastCustom('error', 'Error al asignar los permisos directos', 'Error');
      throw err;
    }
  };

  const handleRemovePermission = async (
    permissionId: number,
    permissionName: string
  ) => {
    if (!user?.userId) return;
    if (
      !confirm(
        `¿Está seguro de que desea revocar el permiso directo "${permissionName}" a este usuario?`
      )
    )
      return;

    try {
      await removePermissionFromUserUseCase.execute(user.userId, permissionId);
      MessageToastCustom(
        'success',
        `Permiso "${permissionName}" revocado correctamente`,
        'Éxito'
      );
      fetchPermissions();
      if (currentUser?.userId === user.userId) {
        await refreshSession().catch(() => {});
      }
    } catch (err: unknown) {
      console.error('Error revoking direct permission', err);
      MessageToastCustom('error', 'Error al revocar el permiso', 'Error');
    }
  };

  if (loading) {
    return (
      <div className="user-detail-loader-container" style={{ height: '140px' }}>
        <Loader size={20} className="animate-spin" />
        <span>Cargando permisos directos...</span>
      </div>
    );
  }

  return (
    <div className="user-detail-table-card">
      <div className="user-detail-table-card__top">
        <div className="user-detail-table-card__title-row">
          <h3>
            <Key size={20} color="var(--primary)" /> Permisos Directos / Temporales
          </h3>
          <span className="user-detail-table-card__count-badge">
            {directPermissions.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<MdAdd size={16} />}
          onClick={() => setIsAssignPermOpen(true)}
        >
          Conceder Permiso Directo
        </Button>
      </div>

      <div className="user-detail-table-wrap">
        <table className="user-detail-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Permiso</th>
              <th>Descripción</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {directPermissions.map((perm) => (
              <tr key={perm.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  #{perm.id}
                </td>
                <td>
                  <div className="user-detail-perm-cell">
                    <span className="user-detail-perm-name">{perm.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {perm.description || 'Sin descripción'}
                </td>
                <td>
                  <div className="user-detail-actions">
                    <Tooltip content="Revocar Permiso Directo" followCursor={false}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemovePermission(perm.id, perm.name)}
                        circle
                        className="user-detail-btn-danger"
                      >
                        <MdDeleteForever size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
            {directPermissions.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="user-detail-table-empty">
                    <Key size={40} style={{ opacity: 0.25 }} />
                    <p>No hay permisos directos asignados a este usuario.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddDirectPermissionModal
        isOpen={isAssignPermOpen}
        onClose={() => setIsAssignPermOpen(false)}
        onSaveBatch={handleAssignBatchDirectPermissions}
        onSave={handleAssignDirectPermission}
        userSelected={user}
        alreadyAssignedIds={directPermissions.map((p) => p.id)}
      />
    </div>
  );
};

export const UserDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const {
    user,
    loading,
    error,
    isEditModalOpen,
    isPasswordModalOpen,
    setIsEditModalOpen,
    setIsPasswordModalOpen,
    handleUpdateUser,
    handleChangePassword
  } = useUserDetailViewModel(username);

  if (loading) {
    return (
      <div className="user-detail-page">
        <div className="user-detail-loader-container">
          <CircularProgress label="Cargando perfil de usuario..." />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-detail-page">
        <div className="user-detail-error-container">
          <div className="user-detail-error-icon">
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
            Usuario no encontrado
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {error || 'No se pudo cargar la información del usuario especificado.'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/users')}
          >
            Volver a Usuarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      {/* Top Navigation & Breadcrumbs */}
      <div className="user-detail-nav">
        <div className="user-detail-nav__breadcrumbs">
          <span
            className="user-detail-nav__link"
            onClick={() => navigate('/users')}
          >
            Usuarios
          </span>
          <span className="user-detail-nav__sep">/</span>
          <span className="user-detail-nav__current">
            {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/users')}
        >
          Volver a Usuarios
        </Button>
      </div>

      {/* Hero Header */}
      <div className="user-detail-hero">
        <div className="user-detail-hero__identity">
          <div className="user-detail-hero__avatar-wrapper">
            <div className="user-detail-hero__avatar">
              {user.firstName
                ? user.firstName.charAt(0).toUpperCase()
                : user.username.charAt(0).toUpperCase()}
            </div>
            <div
              className={`user-detail-hero__status-indicator ${
                user.isActive
                  ? 'user-detail-hero__status-indicator--active'
                  : 'user-detail-hero__status-indicator--inactive'
              }`}
              title={user.isActive ? 'Usuario Activo' : 'Usuario Inactivo'}
            />
          </div>

          <div className="user-detail-hero__details">
            <h1 className="user-detail-hero__name">
              {user.firstName} {user.lastName}
            </h1>
            <div className="user-detail-hero__meta-row">
              <span className="user-detail-hero__username-pill">
                @{user.username}
              </span>
              <span
                className={`users-status-badge ${
                  user.isActive
                    ? 'users-status-badge--active'
                    : 'users-status-badge--inactive'
                }`}
              >
                {user.isActive ? <Check size={12} /> : <X size={12} />}
                {user.isActive ? 'Activo' : 'Inactivo'}
              </span>
              {user.email && (
                <span className="user-detail-hero__meta-item">
                  <Mail size={14} />
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="user-detail-hero__actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 size={15} />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Editar Usuario
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Lock size={15} />}
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Reset Password
          </Button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="user-detail-grid">
        {/* Card: Personal Information */}
        <div className="user-detail-card">
          <div className="user-detail-card__header">
            <div className="user-detail-card__title-group">
              <div className="user-detail-card__icon-badge user-detail-card__icon-badge--blue">
                <UserIcon size={20} />
              </div>
              <h2 className="user-detail-card__title">Información Personal</h2>
            </div>
          </div>

          <div className="user-detail-info-list">
            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <UserIcon size={15} /> Username
              </span>
              <span className="user-detail-info-row__value">{user.username}</span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Mail size={15} /> Correo Electrónico
              </span>
              <span className="user-detail-info-row__value">{user.email || 'No registrado'}</span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Calendar size={15} /> Fecha de Registro
              </span>
              <span className="user-detail-info-row__value">
                {user.registeredAt ? ConverDateTimeToText(user.registeredAt) : 'No disponible'}
              </span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <FaUserShield size={15} /> Cargo en la Empresa
              </span>
              <span className="user-detail-info-row__value">
                {user.positionName ? user.positionName : 'No disponible'}
              </span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <FaFileContract size={15} /> Tipo de Contrato
              </span>
              <span className="user-detail-info-row__value">
                {user.contractTypeName ? user.contractTypeName : 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Card: Account Status & Security */}
        <div className="user-detail-card">
          <div className="user-detail-card__header">
            <div className="user-detail-card__title-group">
              <div className="user-detail-card__icon-badge user-detail-card__icon-badge--emerald">
                <Activity size={20} />
              </div>
              <h2 className="user-detail-card__title">Estado de la Cuenta</h2>
            </div>
          </div>

          <div className="user-detail-info-list">
            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Activity size={15} /> Estado
              </span>
              <span className="user-detail-info-row__value">
                <span
                  className={`users-status-badge ${
                    user.isActive
                      ? 'users-status-badge--active'
                      : 'users-status-badge--inactive'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Calendar size={15} /> Último Acceso
              </span>
              <span className="user-detail-info-row__value">
                {user.lastLogin
                  ? ConverDateTimeToText(user.lastLogin)
                  : 'Last login not available'}
              </span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Lock size={15} /> Intentos Fallidos
              </span>
              <span className="user-detail-info-row__value">
                <ColorChip
                  label={(user.failedAttempts || 0).toString()}
                  color={(user.failedAttempts || 0) > 0 ? '#ef4444' : '#10b981'}
                  variant="soft"
                  icon={
                    (user.failedAttempts || 0) > 0 ? (
                      <X size={15} color="#ef4444" />
                    ) : (
                      <Check size={15} color="#10b981" />
                    )
                  }
                  size="md"
                />
              </span>
            </div>

            <div className="user-detail-info-row">
              <span className="user-detail-info-row__label">
                <Shield size={15} /> Autenticación 2FA
              </span>
              <span className="user-detail-info-row__value">
                <ColorChip
                  label={user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  color={user.twoFactorEnabled ? '#10b981' : '#ef4444'}
                  variant="soft"
                  icon={
                    user.twoFactorEnabled ? (
                      <Lock size={15} color="#10b981" />
                    ) : (
                      <Unlock size={15} color="#ef4444" />
                    )
                  }
                  size="md"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Roles Table Card */}
        <UserRolesTable user={user} />

        {/* Direct Permissions Table Card */}
        <UserDirectPermissionsTable user={user} />
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
