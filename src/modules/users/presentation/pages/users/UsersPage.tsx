import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
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
  Eye,
  Settings,
  SearchX
} from 'lucide-react';
import { UserDetailModal } from '../../components/UserDetailModal/UserDetailModal';
import '@/shared/presentation/styles/Table.css';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';
import '@/shared/presentation/styles/Users.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { useUsersViewModel } from '../../hooks/useUsersViewModel';
import { UserFormWizard } from '../../components/UserFormWizard/UserFormWizard';
import type { User } from '@/modules/users/domain/models/User';
import { UsersProvider } from '../../context/UsersContext';
import { Input } from '@/shared/presentation/components/Input/Input';

const UsersLayout: React.FC = () => {
  const navigate = useNavigate();

  const {
    // Data
    filteredUsers,
    isLoading,
    page,
    setPage,
    hasMore,
    searchTerm,
    setSearchTerm,

    // Modals
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
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

    // Form
    formData,
    handleInputChange,
    resetForm,

    // Actions
    handleCreate,
    handleUpdate,
    handleView,
    handleDelete,
    openEdit
  } = useUsersViewModel();

  // Columns Configuration
  const columns: Column<User>[] = [
    {
      header: 'User',
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
                <span
                  key={roleKey}
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor:
                      'color-mix(in srgb, var(--accent), transparent 90%)',
                    color: 'var(--accent)'
                  }}
                >
                  {roleName}
                </span>
              );
            })
          ) : user.username === 'root' ? (
            <span
              style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
            >
              No roles assigned
            </span>
          ) : (
            <ColorChip
              color="var(--warning)"
              label="All permissions"
              size="sm"
              variant="soft"
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleView(user)}
            title="View Details"
            circle
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/users/${user.username}`)}
            title="Manage User"
            circle
          >
            <Settings size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEdit(user)}
            title="Edit User"
            disabled={user.username === 'root'}
            className={
              user.username === 'root'
                ? `disabled:opacity-50 disabled:cursor-not-allowed`
                : ''
            }
            circle
          >
            <Edit2 size={16} />
          </Button>
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
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="users-page"
      header={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <h1 style={{ margin: 0 }}>Users Management</h1>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            leftIcon={<Plus size={20} />}
          >
            New User
          </Button>
        </div>
      }
      filters={
        <div className="entry-filters">
          <div className="entry-filter-group entry-filter-group--search">
            <label
              className="entry-filter-label"
              style={{ visibility: 'hidden' }}
            >
              Search
            </label>
            <div className="entry-filter-input-wrapper">
              <Input
                type="text"
                className="entry-filter-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search users..."
                value={searchTerm}
                leftIcon={<Search size={18} />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div
            className="entry-filter-group"
            style={{ flex: '0 1 auto', width: 'auto' }}
          >
            <label
              className="entry-filter-label"
              style={{ visibility: 'hidden' }}
            >
              &nbsp;
            </label>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCw size={16} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="table-responsive-wrapper"
        style={{
          flex: 1,
          minHeight: '450px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table
          data={filteredUsers}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              message="No se encontraron usuarios"
              icon={SearchX}
              minHeight="300px"
            />
          }
        />

        <Pagination
          currentPage={page}
          hasMore={hasMore}
          onPageChange={setPage}
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New User"
        size="lg"
        footer={
          <div className="users-modal__footer--between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep > 0) setCurrentStep(currentStep - 1);
                else setIsCreateOpen(false);
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (currentStep < steps.length - 1)
                  setCurrentStep(currentStep + 1);
                else handleCreate();
              }}
            >
              {currentStep === steps.length - 1 ? 'Create User' : 'Next'}
            </Button>
          </div>
        }
      >
        <div className="users-modal__body">
          <div className="users-wizard__stepper">
            {steps.map((step, idx) => (
              <div
                key={step}
                className={`users-wizard__step-indicator ${
                  idx === currentStep
                    ? 'users-wizard__step-indicator--active'
                    : ''
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <UserFormWizard
            currentStep={currentStep}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={false}
            isCreateMode={true}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User"
        size="lg"
        footer={
          <div className="users-modal__footer--end">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        }
      >
        <div className="users-modal__scroll-container">
          <UserFormWizard
            currentStep={0}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={true}
            isCreateMode={false}
          />
          <div className="users-modal__divider"></div>
          <UserFormWizard
            currentStep={1}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={true}
            isCreateMode={false}
          />
          <div className="users-modal__divider"></div>
          <UserFormWizard
            currentStep={2}
            formData={formData}
            onChange={handleInputChange}
            isEditMode={true}
            isCreateMode={false}
          />
          <div className="users-modal__divider"></div>
          <UserFormWizard
            currentStep={3}
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
