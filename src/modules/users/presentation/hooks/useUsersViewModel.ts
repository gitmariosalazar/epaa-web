import { useState, useEffect } from 'react';
import type { User } from '@/modules/users/domain/models/User';
import { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { UserFormData } from '../models/UserFormData';
import { useUsersContext } from '../context/UsersContext';

export const useUsersViewModel = () => {
  // Dependencies (Injected via Context)
  const {
    getUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserDetailUseCase
  } = useUsersContext();

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
  const initialFormData: UserFormData = {
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
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(initialFormData);
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
        password: formData.password!,
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
        ? dateService.toISODateString(user.dateOfBirth)
        : '',
      sexId: user.sexId ? user.sexId.toString() : '',
      idCard: user.idCard || '',
      citizenId: user.citizenId || '',
      positionId: user.positionId ? user.positionId.toString() : '',
      contractTypeId: user.contractTypeId ? user.contractTypeId.toString() : '',
      employeeStatusId: user.employeeStatusId
        ? user.employeeStatusId.toString()
        : '',
      hireDate: user.hireDate ? dateService.toISODateString(user.hireDate) : '',
      terminationDate: user.terminationDate
        ? dateService.toISODateString(user.terminationDate)
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

  return {
    users,
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
  };
};
