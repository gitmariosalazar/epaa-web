import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/modules/users/domain/models/User';
import { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import { GetUsersUseCase } from '@/modules/users/application/usecases/GetUsersUseCase';
import { CreateUserUseCase } from '@/modules/users/application/usecases/CreateUserUseCase';
import { UpdateUserUseCase } from '@/modules/users/application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/modules/users/application/usecases/DeleteUserUseCase';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  XCircle,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react';
import { GetUserDetailUseCase } from '@/modules/users/application/usecases/GetUserDetailUseCase';
import { UserDetailModal } from '@/shared/presentation/components/Users/UserDetailModal';
import '@/shared/presentation/styles/Users.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'Account Details',
    'Personal Info',
    'Employment',
    'Contact & Other'
  ];

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sexId: '',
    idCard: '',
    citizenId: '',
    positionId: '',
    contractTypeId: '',
    employeeStatusId: '',
    hireDate: '',
    terminationDate: '',
    baseSalary: '',
    supervisorId: '',
    assignedZones: '',
    driverLicense: '',
    hasCompanyVehicle: '',
    internalPhone: '',
    internalEmail: '',
    photoUrl: '',
    createdBy: ''
  });

  // Dependencies
  const userRepository = new UserRepositoryImpl();
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const getUserDetailUseCase = new GetUserDetailUseCase(userRepository);

  // Load Data
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getUsersUseCase.execute(limit, offset);
      setUsers(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sexId: '',
      idCard: '',
      citizenId: '',
      positionId: '',
      contractTypeId: '',
      employeeStatusId: '',
      hireDate: '',
      terminationDate: '',
      baseSalary: '',
      supervisorId: '',
      assignedZones: '',
      driverLicense: '',
      hasCompanyVehicle: '',
      internalPhone: '',
      internalEmail: '',
      photoUrl: '',
      createdBy: ''
    });
    setSelectedUser(null);
    setCurrentStep(0);
  };

  const handleCreate = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match"); // Replace with toast later
        return;
      }

      // Create strictly typed request object
      const newUserRequest = new CreateUserEmployeeRequest({
        userId: crypto.randomUUID(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : undefined,
        sexId: formData.sexId ? Number(formData.sexId) : undefined,
        idCard: formData.idCard,
        citizenId: formData.citizenId,
        positionId: Number(formData.positionId),
        contractTypeId: Number(formData.contractTypeId),
        employeeStatusId: formData.employeeStatusId
          ? Number(formData.employeeStatusId)
          : undefined,
        hireDate: new Date(formData.hireDate),
        terminationDate: formData.terminationDate
          ? new Date(formData.terminationDate)
          : undefined,
        baseSalary: formData.baseSalary
          ? Number(formData.baseSalary)
          : undefined,
        supervisorId: formData.supervisorId,
        assignedZones: formData.assignedZones
          ? formData.assignedZones.split(',').map(Number)
          : undefined,
        driverLicense: formData.driverLicense,
        hasCompanyVehicle: formData.hasCompanyVehicle === 'true',
        internalPhone: formData.internalPhone,
        internalEmail: formData.internalEmail,
        photoUrl: formData.photoUrl,
        metadata: undefined,
        createdBy: formData.createdBy
      });

      await createUserUseCase.execute(newUserRequest);
      setIsCreateOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Create failed', error);
      alert('Failed to create user');
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '',
      sexId: user.sexId ? user.sexId.toString() : '',
      idCard: user.idCard || '',
      citizenId: user.citizenId || '',
      positionId: user.positionId ? user.positionId.toString() : '',
      contractTypeId: user.contractTypeId ? user.contractTypeId.toString() : '',
      employeeStatusId: user.employeeStatusId
        ? user.employeeStatusId.toString()
        : '',
      hireDate: user.hireDate
        ? new Date(user.hireDate).toISOString().split('T')[0]
        : '',
      terminationDate: user.terminationDate
        ? new Date(user.terminationDate).toISOString().split('T')[0]
        : '',
      baseSalary: user.baseSalary ? user.baseSalary.toString() : '',
      supervisorId: user.supervisorId || '',
      assignedZones: user.assignedZones ? user.assignedZones.toString() : '',
      driverLicense: user.driverLicense || '',
      hasCompanyVehicle: user.hasCompanyVehicle
        ? user.hasCompanyVehicle.toString()
        : '',
      internalPhone: user.internalPhone || '',
      internalEmail: user.internalEmail || '',
      photoUrl: user.photoUrl || '',
      createdBy: user.createdBy || ''
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match"); // Replace with toast later
        return;
      }

      const updateRequest = new UpdateUserRequest({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : undefined,
        sexId: formData.sexId ? Number(formData.sexId) : undefined,
        idCard: formData.idCard,
        citizenId: formData.citizenId,
        positionId: formData.positionId
          ? Number(formData.positionId)
          : undefined,
        contractTypeId: formData.contractTypeId
          ? Number(formData.contractTypeId)
          : undefined,
        employeeStatusId: formData.employeeStatusId
          ? Number(formData.employeeStatusId)
          : undefined,
        terminationDate: formData.terminationDate
          ? new Date(formData.terminationDate)
          : undefined,
        baseSalary: formData.baseSalary
          ? Number(formData.baseSalary)
          : undefined,
        supervisorId: formData.supervisorId,
        assignedZones: formData.assignedZones
          ? formData.assignedZones.split(',').map(Number)
          : undefined,
        driverLicense: formData.driverLicense,
        hasCompanyVehicle: formData.hasCompanyVehicle === 'true',
        internalPhone: formData.internalPhone,
        internalEmail: formData.internalEmail,
        photoUrl: formData.photoUrl,
        metadata: undefined
      });

      await updateUserUseCase.execute(
        selectedUser?.userId || '',
        updateRequest
      );
      setIsEditOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update user');
    }
  };

  const handleView = async (user: User) => {
    setIsViewOpen(true);
    setIsViewLoading(true);
    setViewUser(null);
    try {
      const fullUser = await getUserDetailUseCase.execute(
        user.username,
        user.email
      );
      setViewUser(fullUser);
    } catch (error) {
      console.error('Failed to fetch user details', error);
      alert('Failed to load user details');
      setIsViewOpen(false);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserUseCase.execute(selectedUser.userId);
      setIsDeleteOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Wizard Rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Account Details
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="jdoe"
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </div>

            {/* Password only for Create or explicit change */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={
                  isEditOpen ? 'Leave blank to keep current' : '••••••••'
                }
                showStrength={true}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                showStrength={false}
                valueToMatch={formData.password}
              />
            </div>
          </div>
        );

      case 1: // Personal Info
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <Input
                label="Sex ID"
                type="number"
                name="sexId"
                value={formData.sexId}
                onChange={handleInputChange}
                placeholder="1"
              />
              <Input
                label="ID Card"
                name="idCard"
                value={formData.idCard}
                onChange={handleInputChange}
                placeholder="1234567890"
              />
            </div>
            <Input
              label="Citizen ID"
              name="citizenId"
              value={formData.citizenId}
              onChange={handleInputChange}
              placeholder="Optional citizen reference"
            />
          </div>
        );

      case 2: // Employment Details
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Position ID"
                type="number"
                name="positionId"
                value={formData.positionId}
                onChange={handleInputChange}
              />
              <Input
                label="Contract Type ID"
                type="number"
                name="contractTypeId"
                value={formData.contractTypeId}
                onChange={handleInputChange}
              />
              <Input
                label="Status ID"
                type="number"
                name="employeeStatusId"
                value={formData.employeeStatusId}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Hire Date"
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
              />
              <Input
                label="Termination Date"
                type="date"
                name="terminationDate"
                value={formData.terminationDate}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Base Salary"
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleInputChange}
              />
              <Input
                label="Supervisor ID"
                name="supervisorId"
                value={formData.supervisorId}
                onChange={handleInputChange}
              />
            </div>
            <Input
              label="Assigned Zones"
              name="assignedZones"
              value={formData.assignedZones}
              onChange={handleInputChange}
              placeholder="1, 2, 3"
            />
          </div>
        );

      case 3: // Contact & Other
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Internal Phone"
                name="internalPhone"
                value={formData.internalPhone}
                onChange={handleInputChange}
              />
              <Input
                label="Internal Email"
                type="email"
                name="internalEmail"
                value={formData.internalEmail}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Input
                label="Driver License"
                name="driverLicense"
                value={formData.driverLicense}
                onChange={handleInputChange}
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}
                >
                  Has Company Vehicle
                </label>
                <select
                  name="hasCompanyVehicle"
                  value={formData.hasCompanyVehicle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasCompanyVehicle: e.target.value
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <Input
              label="Photo URL"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
            />
            {isCreateOpen && (
              <Input
                label="Created By"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderWizardFooter = (onCancel: () => void, onSubmit: () => void) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Button
          variant="subtle"
          onClick={
            currentStep === 0
              ? onCancel
              : () => setCurrentStep((prev) => prev - 1)
          }
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginRight: '8px'
            }}
          >
            Step {currentStep + 1} of {steps.length}
          </span>
          <Button
            onClick={
              currentStep === steps.length - 1
                ? onSubmit
                : () => setCurrentStep((prev) => prev + 1)
            }
          >
            {currentStep === steps.length - 1
              ? isEditOpen
                ? 'Save Changes'
                : 'Create User'
              : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="users-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <div className="users-header">
          <h1>Users Management</h1>
          <p>Manage user access and details</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            onClick={loadUsers}
            title="Refresh List"
            circle
          >
            <RefreshCw size={18} />
          </Button>
          <Button
            variant="outline"
            leftIcon={<Plus size={18} />}
            onClick={() => setIsCreateOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>
      <Card>
        {/* Simple Search Placeholder - To be fully implemented with backend support */}
        <div
          style={{
            padding: 'var(--spacing-md)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '300px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            />
            <input
              type="text"
              placeholder="Search users..."
              style={{
                width: '100%',
                padding: '8px 10px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface)', // Changed from background to surface for better contrast
                color: 'var(--text-main)', // Fix for dark mode text color
                outline: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table data={filteredUsers} columns={columns} isLoading={isLoading} />

        <Pagination
          currentPage={page}
          onPageChange={setPage}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </Card>

      <UserDetailModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={viewUser}
        isLoading={isViewLoading}
      />

      {/* CREATE MODAL */}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={`Create New User - ${steps[currentStep]}`}
        footer={renderWizardFooter(() => setIsCreateOpen(false), handleCreate)}
      >
        {renderStepContent()}
      </Modal>
      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit User - ${steps[currentStep]}`}
        footer={renderWizardFooter(() => setIsEditOpen(false), handleUpdate)}
      >
        {renderStepContent()}
      </Modal>
      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <>
            <Button variant="subtle" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Are you sure you want to delete user{' '}
          <strong style={{ color: 'var(--text-main)' }}>
            {selectedUser?.username}
          </strong>
          ?
          <br />
          This action will restrict their access immediately.
        </p>
      </Modal>
    </div>
  );
};
