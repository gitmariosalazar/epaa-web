import { useState, useEffect } from 'react';
import type { User } from '@/modules/users/domain/models/User';
import { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { UserFormData } from '../models/UserFormData';
import { useUsersContext } from '../context/UsersContext';

/**
 * ViewModel para la página de usuarios.
 * Principio de Responsabilidad Única (SRP): maneja estado y lógica de UI.
 * Principio de Inversión de Dependencias (DIP): depende de abstracciones
 * (use cases) inyectadas via Context, no de implementaciones concretas.
 */
export const useUsersViewModel = () => {
  // Dependencies (Injected via Context)
  const {
    getUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserDetailUseCase,
    getCustomerByIdentificationUseCase,
    existsByUsernameUseCase
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

  // Wizard State — 3 pasos alineados con el endpoint
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Ficha del Empleado', 'Datos Laborales', 'Datos de Acceso'];

  // Auto-fill State — patrón inspirado en RegisterPage de customers
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillMessage, setAutoFillMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State — organizado por pasos del wizard
  const initialFormData: UserFormData = {
    // Step 1 — Ficha del Empleado
    idCard: '',
    citizenId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sexId: '1',
    // Step 1 — Ubicación Domiciliaria (defaults Ecuador)
    address: '',
    countryId: 'ECU',
    provinceId: '',
    cantonId: '',
    parishId: '',
    // Step 2 — Datos Laborales
    positionId: '',
    contractTypeId: '',
    hireDate: '',
    baseSalary: '',
    internalPhone: '',
    internalEmail: '',
    // Step 3 — Datos de Acceso
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  // Auto-sync: al llegar al Step 3, username = cédula, email = internalEmail
  useEffect(() => {
    if (currentStep === 2) {
      setFormData((prev) => ({
        ...prev,
        username: prev.idCard?.trim() || prev.username,
        email: prev.internalEmail?.trim() || prev.email
      }));
    }
  }, [currentStep]);

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

  // Handlers — acepta ChangeEvent real y objetos sintéticos del DatePicker
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any; type?: string } }
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedUser(null);
    setCurrentStep(0);
    setAutoFillMessage(null);
  };

  /**
   * Busca un cliente por cédula usando GET /Customers/get-customer-by-id/:customerId
   * y pre-llena el formulario. Mismo endpoint y patrón que RegisterPage de customers.
   *
   * Clean Architecture: usa el use case del módulo customers (cross-module).
   * SOLID (DIP): depende de la abstracción GetCustomerByIdentificationUseCase.
   */
  const handleIdCardLookup = async (idCard: string) => {
    const trimmed = idCard.trim();

    // Validar formato: solo dígitos
    if (!trimmed || !/^\d+$/.test(trimmed)) {
      setAutoFillMessage('Ingresa un número de cédula válido');
      return;
    }

    setIsAutoFilling(true);
    setAutoFillMessage(null);

    try {
      const customer =
        await getCustomerByIdentificationUseCase.execute(trimmed);

      if (customer) {
        // Pre-llenar formulario con datos del Customer (mismo mapeo que RegisterPage)
        setFormData((prev) => ({
          ...prev,
          // Step 1 — Ficha del Empleado
          idCard: trimmed,
          citizenId: trimmed,
          firstName: customer.firstName || prev.firstName,
          lastName: customer.lastName || prev.lastName,
          dateOfBirth: customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toISOString().split('T')[0]
            : prev.dateOfBirth,
          sexId: customer.sexId ? customer.sexId.toString() : prev.sexId,
          // Step 1 — Ubicación (LocationSelector resuelve la jerarquía automáticamente con parishId)
          address: customer.address || prev.address,
          parishId: customer.parishId || prev.parishId,
          // Step 2 — Contacto (usa email y teléfono del customer)
          internalPhone:
            customer.phoneNumbers && customer.phoneNumbers.length > 0
              ? customer.phoneNumbers[0]
              : prev.internalPhone,
          internalEmail:
            customer.emails && customer.emails.length > 0
              ? customer.emails[0]
              : prev.internalEmail,
          // Step 3 — Datos de Acceso
          username: trimmed, // username = cédula
          email:
            customer.emails && customer.emails.length > 0
              ? customer.emails[0]
              : prev.email
        }));

        setAutoFillMessage('✓ Datos del cliente cargados automáticamente');
      } else {
        // No encontrado — limpiar todo, conservar solo la cédula (mismo patrón que RegisterPage)
        setFormData({
          ...initialFormData,
          idCard: trimmed
        });
        setAutoFillMessage(
          'No se encontró un cliente con esta cédula. Completa los datos manualmente.'
        );
      }
    } catch (error) {
      console.error('[UsersViewModel] Customer lookup failed:', error);
      // No encontrado (404) — limpiar todo, conservar solo la cédula
      setFormData({
        ...initialFormData,
        idCard: trimmed
      });
      setAutoFillMessage(
        'No se encontró un cliente con esta cédula. Completa los datos manualmente.'
      );
    } finally {
      setIsAutoFilling(false);
    }
  };

  /**
   * Crea un usuario-empleado con los datos del formulario.
   * Validaciones pre-creación:
   * 1. Contraseñas coinciden
   * 2. Username no existe (evita error 500 por unicidad)
   * Convierte strings del formulario a tipos del DTO (SRP del mapper).
   */
  const handleCreate = async () => {
    try {
      // Validación: contraseñas
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Validación: username único (evita error 500 del backend)
      const usernameExists = await existsByUsernameUseCase.execute(
        formData.username
      );
      console.log(usernameExists);
      if (!usernameExists) {
        alert(
          `El usuario "${formData.username}" ya existe en el sistema. ` +
            'No se puede crear un usuario duplicado.'
        );
        return;
      }

      const newUserRequest = new CreateUserEmployeeRequest({
        username: formData.username,
        email: formData.email,
        password: formData.password!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        sexId: Number(formData.sexId),
        idCard: formData.idCard,
        citizenId: formData.citizenId,
        positionId: Number(formData.positionId),
        hireDate: formData.hireDate,
        contractTypeId: Number(formData.contractTypeId),
        baseSalary: Number(formData.baseSalary),
        internalPhone: formData.internalPhone,
        internalEmail: formData.internalEmail
      });

      await createUserUseCase.execute(newUserRequest);
      setIsCreateOpen(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      console.error('[UsersViewModel] Create failed:', error);
      // Parsear mensaje del backend para mostrarlo al usuario
      const backendMessage =
        error?.response?.data?.message?.[0] ||
        error?.message ||
        'Error desconocido al crear el usuario';
      alert(`Error al crear usuario: ${backendMessage}`);
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
      // Ubicación (se resuelve automáticamente con parishId en LocationSelector)
      address: '',
      countryId: 'ECU',
      provinceId: '',
      cantonId: '',
      parishId: '',
      positionId: user.positionId ? user.positionId.toString() : '',
      contractTypeId: user.contractTypeId ? user.contractTypeId.toString() : '',
      hireDate: user.hireDate ? dateService.toISODateString(user.hireDate) : '',
      baseSalary: user.baseSalary ? user.baseSalary.toString() : '',
      internalPhone: user.internalPhone || '',
      internalEmail: user.internalEmail || ''
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
        baseSalary: formData.baseSalary
          ? Number(formData.baseSalary)
          : undefined,
        internalPhone: formData.internalPhone,
        internalEmail: formData.internalEmail
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

  /**
   * Validación por paso del wizard.
   * Retorna mensaje de error si falla, null si pasa.
   */
  const validateCurrentStep = (): string | null => {
    switch (currentStep) {
      case 0: // Ficha del Empleado
        if (!formData.idCard?.trim()) return 'La cédula es obligatoria';
        if (!formData.firstName?.trim()) return 'El nombre es obligatorio';
        if (!formData.lastName?.trim()) return 'El apellido es obligatorio';
        if (!formData.dateOfBirth?.trim()) return 'La fecha de nacimiento es obligatoria';
        if (!formData.sexId) return 'El sexo es obligatorio';
        return null;

      case 1: // Datos Laborales
        if (!formData.positionId?.trim()) return 'El cargo es obligatorio';
        if (!formData.contractTypeId?.trim()) return 'El tipo de contrato es obligatorio';
        if (!formData.hireDate?.trim()) return 'La fecha de contratación es obligatoria';
        if (!formData.baseSalary?.trim()) return 'El salario base es obligatorio';
        if (!formData.internalPhone?.trim()) return 'El teléfono interno es obligatorio';
        if (!formData.internalEmail?.trim()) return 'El email interno es obligatorio';
        return null;

      case 2: // Datos de Acceso
        if (!formData.username?.trim()) return 'El nombre de usuario es obligatorio';
        if (!formData.email?.trim()) return 'El correo electrónico es obligatorio';
        if (!formData.password?.trim()) return 'La contraseña es obligatoria';
        if (!formData.confirmPassword?.trim()) return 'Confirme la contraseña';
        if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
        return null;

      default:
        return null;
    }
  };

  return {
    // Data
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
    openEdit,
    refresh: loadUsers
  };
};
