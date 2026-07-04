/**
 * DTO para crear un usuario-empleado.
 * Alineado con el endpoint POST /user-employee-gateway/create.
 * Principio de Segregación de Interfaces (ISP): solo contiene
 * los campos que el endpoint realmente acepta.
 */
export class CreateUserEmployeeRequest {
  // Datos de autenticación
  readonly username: string;
  readonly email: string;
  readonly password: string;

  // Datos personales
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: string;
  readonly sexId: number;
  readonly idCard: string;
  readonly citizenId: string;

  // Datos laborales
  readonly positionId: number;
  readonly hireDate: string;
  readonly contractTypeId: number;
  readonly baseSalary: number;

  // Contacto interno
  readonly internalPhone: string;
  readonly internalEmail: string;

  constructor(params: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    sexId: number;
    idCard: string;
    citizenId: string;
    positionId: number;
    hireDate: string;
    contractTypeId: number;
    baseSalary: number;
    internalPhone: string;
    internalEmail: string;
  }) {
    this.username = params.username;
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.dateOfBirth = params.dateOfBirth;
    this.sexId = params.sexId;
    this.idCard = params.idCard;
    this.citizenId = params.citizenId;
    this.positionId = params.positionId;
    this.hireDate = params.hireDate;
    this.contractTypeId = params.contractTypeId;
    this.baseSalary = params.baseSalary;
    this.internalPhone = params.internalPhone;
    this.internalEmail = params.internalEmail;
  }
}
