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
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import '@/shared/presentation/styles/Users.css';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            name={
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username
            }
            size="sm"
          />
          <div>
            <div style={{ fontWeight: 500 }}>{user.username}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => {
              const roleName = typeof role === 'string' ? role : role.name;
              const roleKey =
                typeof role === 'string' ? role : role.id || roleName;
              return (
                <ColorChip
                  key={roleKey}
                  status='info'
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
      header: 'Status',
      accessor: (user: User) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: user.isActive ? 'var(--success)' : 'var(--error)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          {user.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip content="Ver detalles" position="top" followCursor={false}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleView(user)}
              circle
            >
              <Eye size={16} />
            </Button>
          </Tooltip>

          <Tooltip content="Gestionar" position="top" followCursor={false}>
            <Button
              size="sm"
              variant="ghost"
              circle
              onClick={() => navigate(`/users/${user.username}`)}
            >
              <Settings size={16} />
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
              <Edit2 size={16} />
            </Button>
          </Tooltip>

          <Tooltip content="Eliminar" position="top" followCursor={false}>
            <Button
              size="sm"
              variant="ghost"
              style={{ color: 'var(--error)' }}
              disabled={user.username === 'root'}
              className={
                user.username === 'root'
                  ? `disabled:opacity-50 disabled:cursor-not-allowed`
                  : ''
              }
              onClick={() => {
                setSelectedUser(user);
                setIsDeleteOpen(true);
              }}
              title="Delete User"
              circle
            >
              <Trash2 size={16} />
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
              <MdSecurity size={16} />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="users-page"

      filters={
        <div className="entry-filters">
          <div className="entry-filter-group entry-filter-group--search">

            <div className="entry-filter-input-wrapper">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                leftIcon={<Search size={18} />}
                size='small'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div
            className="entry-filter-group trash-report-filter-right"
            style={{ flex: '0 1 auto', width: 'auto' }}
          >

            <Button
              variant="outline"
              onClick={refresh}
              leftIcon={<RefreshCw size={16} />}
              size='compact'
              style={{ height: '30px' }}
            >
              Refresh
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              leftIcon={<Plus size={14} />}
              size='compact'
              style={{ height: '30px' }}
              variant='dashed'
              color='green'
            >
              New User
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="table-responsive-wrapper"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table
          data={filteredUsers}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={10}
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
          <div style={{ width: '100%' }}>
            {validationError && (
              <div style={{ marginBottom: '12px' }}>
                <Alert
                  type="error"
                  message={validationError}
                  dismissible
                  onClose={() => setValidationError(null)}
                />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setValidationError(null);
                  if (currentStep > 0) setCurrentStep(currentStep - 1);
                  else setIsCreateOpen(false);
                }}
              >
                Atrás
              </Button>
              <Button
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
                {currentStep === steps.length - 1 ? 'Crear Empleado' : 'Siguiente'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="users-modal__body">
          <div className="users-wizard__stepper">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div
                  className={`users-wizard__step-item${idx === currentStep
                    ? ' users-wizard__step-item--active'
                    : ''
                    }${idx < currentStep ? ' users-wizard__step-item--completed' : ''}`}
                >
                  <div className="users-wizard__step-number">
                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                  </div>
                  <div className="users-wizard__step-label">{step}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`users-wizard__step-connector${idx < currentStep
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
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Usuario"
        size="lg"
        footer={
          <div style={{ width: '100%' }}>
            {validationError && (
              <div style={{ marginBottom: '12px' }}>
                <Alert 
                  type="error" 
                  message={validationError} 
                  dismissible
                  onClose={() => setValidationError(null)}
                />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="outline"
                disabled={currentStep === 0}
                onClick={() => {
                  setValidationError(null);
                  if (currentStep > 0) setCurrentStep(currentStep - 1);
                }}
              >
                Atrás
              </Button>
              <Button
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
                {currentStep === steps.length - 1 ? 'Guardar Cambios' : 'Siguiente'}
              </Button>
            </div>
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
                  }${idx < currentStep ? ' users-wizard__step-item--completed' : ''}`}
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
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete user{' '}
          <strong>{selectedUser?.username}</strong>? This action cannot be
          undone.
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
