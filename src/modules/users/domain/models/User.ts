import type { RolOrPermission } from '@/shared/utils/interfaces/RolOrPermission';

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  sexId?: number;
  idCard?: string;
  cardId?: string;
  citizenId?: string;
  positionId?: number;
  contractTypeId?: number;
  employeeStatusId?: number;
  hireDate?: Date;
  terminationDate?: Date;
  baseSalary?: number;
  supervisorId?: string;
  assignedZones?: number[];
  driverLicense?: string;
  hasCompanyVehicle?: boolean;
  internalPhone?: string;
  internalEmail?: string;
  photoUrl?: string;
  createdBy?: string;
  roles: RolOrPermission[];
  permissions: RolOrPermission[];
  isActive: boolean;
  registeredAt: Date;
  lastLogin?: Date | null;
  failedAttempts?: number;
  twoFactorEnabled?: boolean;
  observations?: string | null;
  positionName?: string;
  contractTypeName?: string;
}
