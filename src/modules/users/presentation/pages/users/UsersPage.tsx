import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  XCircle,
  CheckCircle,
  Check,
  Eye,
  Settings,
  SearchX,
  Shield
} from 'lucide-react';
import { UserDetailModal } from '../../components/UserDetailModal/UserDetailModal';
import AddRoleModal from '../../components/AddRoleModal/AddRoleModal';
import '@/shared/presentation/styles/Table.css';
import '@/shared/presentation/styles/Users.css';
import './UsersPage.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { useUsersViewModel } from '../../hooks/useUsersViewModel';
import { UserFormWizard } from '../../components/UserFormWizard/UserFormWizard';
import type { User } from '@/modules/users/domain/models/User';
import { UsersProvider } from '../../context/UsersContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Alert } from '@/shared/presentation/components/Alert/Alert';
import { BiSolidErrorAlt } from 'react-icons/bi';
import { MdSecurity } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import type { RolOrPermission } from '@/shared/utils/interfaces/RolOrPermission';

const UsersLayout: React.FC = () => {
  const navigate = useNavigate();

  const {
    // Data
    filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,

    // Modals
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isAssignRoleOpen,
    setIsAssignRoleOpen,
    selectedUser,
    setSelectedUser,
    isViewOpen,
    setIsViewOpen,
    viewUser,
    isViewLoading,

    // Wizard
    currentStep,
    setCurrentStep,
    steps,
    validateCurrentStep,

    // Form
    formData,
    handleInputChange,
    resetForm,

    // Auto-fill
    isAutoFilling,
    autoFillMessage,
    handleIdCardLookup,
    validationError,
    setValidationError,
    isSubmitting,

    // Actions
    handleCreate,
    handleUpdate,
    handleView,
    handleDelete,
    handleAssignRole,
    openEdit,
    refresh
  } = useUsersViewModel();

  // Columns Configuration
  const columns: Column<User>[] = [
    {
      header: 'Username',
      accessor: (user: User) => (
        <div className="users-cell-user">
          <Avatar
            name={
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username
            }
            size="sm"
          />
          <div className="users-cell-user__details">
            <div className="users-cell-user__username">{user.username}</div>
            <div className="users-cell-user__fullname">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Roles',
      accessor: (user: User) => (
        <div className="users-cell-roles">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role: RolOrPermission) => {
              const roleName: string = role.name;
              const roleKey: number = role.id;
              return (
                <ColorChip
                  key={roleKey}
                  status="info"
                  label={roleName}
                  borderRadius={5}
                  size="xs"
                  variant="solid"
                  icon={<MdSecurity size={12} />}
                />
              );
            })
          ) : user.username !== 'root' ? (
            <ColorChip
              color="var(--error)"
              label="Sin asignar roles"
              size="sm"
              variant="soft"
              icon={<BiSolidErrorAlt />}
            />
          ) : (
            <ColorChip
              color="var(--warning)"
              label="Todos los permisos"
              size="sm"
              variant="soft"
              icon={<Shield />}
            />
          )}
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (user: User) => (
        <span
          className={`users-status-badge ${
            user.isActive
              ? 'users-status-badge--active'
              : 'users-status-badge--inactive'
          }`}
        >
          {user.isActive ? <CheckCircle size={13} /> : <XCircle size={13} />}
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (user: User) => {
        const iconSize: number = 13;
        return (
          <div className="users-cell-actions">
            <Tooltip content="Ver detalles" position="top" followCursor={false}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleView(user)}
                circle
              >
                <Eye size={iconSize} />
              </Button>
            </Tooltip>

            <Tooltip content="Gestionar" position="top" followCursor={false}>
              <Button
                size="sm"
                variant="ghost"
                circle
                onClick={() => navigate(`/users/${user.username}`)}
              >
                <Settings size={iconSize} />
              </Button>
            </Tooltip>
            <Tooltip content="Editar" position="top" followCursor={false}>
              <Button
                size="sm"
                variant="ghost"
                disabled={user.username === 'root'}
                className={
                  user.username === 'root'
                    ? `disabled:opacity-50 disabled:cursor-not-allowed`
                    : ''
                }
                circle
                onClick={() => openEdit(user)}
              >
                <Edit2 size={iconSize} />
              </Button>
            </Tooltip>

            <Tooltip content="Eliminar" position="top" followCursor={false}>
              <Button
                size="sm"
                variant="ghost"
                disabled={user.username === 'root'}
                className={
                  user.username === 'root'
                    ? `disabled:opacity-50 disabled:cursor-not-allowed`
                    : 'users-btn--delete'
                }
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteOpen(true);
                }}
                title="Delete User"
                circle
              >
                <Trash2 size={iconSize} />
              </Button>
            </Tooltip>
            <Tooltip content="Asignar rol" position="top" followCursor={false}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedUser(user);
                  setIsAssignRoleOpen(true);
                }}
                circle
              >
                <MdSecurity size={iconSize} />
              </Button>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <PageLayout
      className="users-page"
      filters={
        <div className="users-toolbar">
          <div className="users-toolbar__search-group">
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              leftIcon={<Search size={18} />}
              size="small"
              className="users-toolbar__search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="users-toolbar__actions">
            <Button
              variant="outline"
              onClick={refresh}
              leftIcon={<RefreshCw size={15} />}
              size="small"
              className="users-toolbar__btn"
            >
              Refrescar
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              leftIcon={<Plus size={15} />}
              size="small"
              className="users-toolbar__btn"
              variant="dashed"
              color="green"
            >
              Nuevo Usuario
            </Button>
          </div>
        </div>
      }
    >
      <div className="users-table-container">
        <Table
          data={filteredUsers}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={15}
          emptyState={
            <EmptyState
              message="No se encontraron usuarios"
              description="Intenta ajustar los filtros de búsqueda para ver los resultados."
              icon={SearchX}
              minHeight="300px"
              variant="info"
            />
          }
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Usuario"
        size="lg"
        footer={
          <div className="users-modal__footer-row">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setValidationError(null);
                if (currentStep > 0) setCurrentStep(currentStep - 1);
                else setIsCreateOpen(false);
              }}
            >
              Atrás
            </Button>
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                const error = validateCurrentStep();
                if (error) {
                  setValidationError(error);
                  return;
                }
                setValidationError(null);
                if (currentStep < steps.length - 1)
                  setCurrentStep(currentStep + 1);
                else handleCreate();
              }}
            >
              {currentStep === steps.length - 1
                ? 'Crear Empleado'
                : 'Siguiente'}
            </Button>
          </div>
        }
      >
        <div className="users-modal__body">
          <div className="users-wizard__stepper">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div
                  className={`users-wizard__step-item${
                    idx === currentStep
                      ? ' users-wizard__step-item--active'
                      : ''
                  }${
                    idx < currentStep ? ' users-wizard__step-item--completed' : ''
                  }`}
                >
                  <div className="users-wizard__step-number">
                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                  </div>
                  <div className="users-wizard__step-label">{step}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`users-wizard__step-connector${
                      idx < currentStep
                        ? ' users-wizard__step-connector--active'
                        : ''
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <UserFormWizard
            currentStep={currentStep}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={false}
            isCreateMode={true}
            onIdCardLookup={handleIdCardLookup}
            isAutoFilling={isAutoFilling}
            autoFillMessage={autoFillMessage}
          />
          {validationError && (
            <div className="users-modal__alert-wrapper">
              <Alert
                type="error"
                message={validationError}
                dismissible
                onClose={() => setValidationError(null)}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Usuario"
        size="lg"
        footer={
          <div className="users-modal__footer-row">
            <Button
              variant="outline"
              disabled={currentStep === 0 || isSubmitting}
              onClick={() => {
                setValidationError(null);
                if (currentStep > 0) setCurrentStep(currentStep - 1);
              }}
            >
              Atrás
            </Button>
            <Button
              isLoading={isSubmitting}
              onClick={() => {
                const error = validateCurrentStep();
                if (error) {
                  setValidationError(error);
                  return;
                }
                setValidationError(null);
                if (currentStep < steps.length - 1)
                  setCurrentStep(currentStep + 1);
                else handleUpdate();
              }}
            >
              {currentStep === steps.length - 1
                ? 'Guardar Cambios'
                : 'Siguiente'}
            </Button>
          </div>
        }
      >
        <div className="users-modal__body">
          <div className="users-wizard__stepper">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div
                  className={`users-wizard__step-item${
                    idx === currentStep
                      ? ' users-wizard__step-item--active'
                      : ''
                  }${
                    idx < currentStep ? ' users-wizard__step-item--completed' : ''
                  }`}
                >
                  <div className="users-wizard__step-number">
                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                  </div>
                  <div className="users-wizard__step-label">{step}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`users-wizard__step-connector${
                      idx < currentStep
                        ? ' users-wizard__step-connector--active'
                        : ''
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <UserFormWizard
            currentStep={currentStep}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={true}
            isCreateMode={false}
          />

          {validationError && (
            <div className="users-modal__alert-wrapper">
              <Alert
                type="error"
                message={validationError}
                dismissible
                onClose={() => setValidationError(null)}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
        footer={
          <div className="users-modal__footer-delete">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="users-btn--delete"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="users-delete-confirm-text">
          ¿Está seguro de que desea eliminar al usuario{' '}
          <strong>{selectedUser?.username}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* View Details Modal */}
      <UserDetailModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={viewUser}
        isLoading={isViewLoading}
      />

      {/* Assign Role Modal */}
      {selectedUser && (
        <AddRoleModal
          isOpen={isAssignRoleOpen}
          onClose={() => setIsAssignRoleOpen(false)}
          onSave={handleAssignRole}
          userSelected={selectedUser}
        />
      )}
    </PageLayout>
  );
};

export const UsersPage: React.FC = () => {
  return (
    <UsersProvider>
      <UsersLayout />
    </UsersProvider>
  );
};
