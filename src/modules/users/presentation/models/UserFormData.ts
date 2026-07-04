/**
 * Modelo de datos del formulario de usuario-empleado.
 * Todos los valores son string porque vienen de inputs HTML.
 * La conversión a tipos reales se hace en el ViewModel (SRP).
 *
 * Organizado en 3 pasos como el RegisterPage de customers:
 * Step 1: Ficha del Empleado (datos personales + ubicación + búsqueda por cédula)
 * Step 2: Datos Laborales y Contacto
 * Step 3: Datos de Acceso (contraseñas al final)
 */
export interface UserFormData {
  // Step 1 — Ficha del Empleado
  idCard: string;
  citizenId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sexId: string;

  // Step 1 — Ubicación Domiciliaria (como en CustomerForm)
  address: string;
  countryId: string;
  provinceId: string;
  cantonId: string;
  parishId: string;

  // Step 2 — Datos Laborales y Contacto
  positionId: string;
  contractTypeId: string;
  hireDate: string;
  baseSalary: string;
  internalPhone: string;
  internalEmail: string;

  // Step 3 — Datos de Acceso
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
