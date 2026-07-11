// 1. Interfaces para la información de contacto y multimedia
export interface ContactPhoneResponse {
  telefonoId: number;
  numero: string;
}

export interface ContactEmailResponse {
  emailId: number;
  correo: string;
}

export interface EvidencePhotoResponse {
  id: number;
  filePath: string;
  type: 'REPORTE' | 'RESOLUCION';
  createdAt: string; // ISO 8601 Date string
}

export interface ManagedByUser {
  nombre: string;
  apellido: string;
  correo?: string;
  celular?: string;
}

export interface IncidentHistoryResponse {
  dateChange: string; // ISO 8601 Date string
  previousStatus: string | null;
  newStatus: string;
  managedBy: string | ManagedByUser | null;
  observation: string | null;
}

// 2. Interfaces para los objetos JSON del usuario que reporta
export interface ReporterCompanyResponse {
  companyId: string; // UUID
  commercialName: string | null;
  businessName: string | null;
  ruc: string;
  address: string | null;
  parishId: string | null;
  country: string | null;
  clientId: string;
  phones: ContactPhoneResponse[];
  emails: ContactEmailResponse[];
}

export interface ReporterPersonResponse {
  personId: string;
  firstName: string;
  lastName: string;
  birthDate: string | null; // Date string
  isDeceased: boolean;
  genderId: number;
  civilStatusId: number;
  professionId: number;
  parishId: string;
  address: string | null;
  country: string | null;
  phones: ContactPhoneResponse[];
  emails: ContactEmailResponse[];
}

export interface ReporterEmployeeResponse {
  employeeId: string; // UUID
  userId: string; // UUID
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserRowResponse {
  name: string; // UUID
  cardId: string;
  userType: string;
  email: string | null;
  phone: string | null;
}

// 3. Interfaz Principal (La Fila de la Vista)
export interface IncidentDetailRowResponse {
  incidentId: string;
  connectionId: string | null;
  incidentCode: string;
  readingId: number | null;

  // Categoría y Tipo
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  incidentTypeId: number;
  incidentTypeName: string;
  suggestedPriority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

  // Información del Reporte
  reportDescription: string;
  referenceAddress: string | null;
  status: 'REPORTADO' | 'EN_INSPECCION' | 'RESUELTO' | 'FALSO_REPORTE';
  reportOrigin:
    | 'LECTURISTA'
    | 'ATENCION_AL_CLIENTE'
    | 'INSPECTOR'
    | 'WEB_USUARIO';
  currentPriority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  reportDate: string; // ISO 8601 Date string
  latitude: number | null;
  longitude: number | null;

  // Usuario que reporta
  reportedBy: UserRowResponse; // Resumen en texto: Ej. "EMPLEADO: Juan Perez"
  company: ReporterCompanyResponse | null;
  person: ReporterPersonResponse | null;

  // Resolución
  resolutionDate: string | null; // ISO 8601 Date string
  resolvedBy: UserRowResponse | null;
  resolutionDescription: string | null;

  // Aspectos financieros
  chargeToUser: boolean;
  repairCost: number | string; // postgres numeric retorna string en node-postgres por defecto (puedes usar Number(x))

  // Evidencias (Reporte y Resolución)
  photosReport: EvidencePhotoResponse[];
  photosReportCount: number | string; // postgres count(x) retorna bigint como string

  photosResolution: EvidencePhotoResponse[];
  photosResolutionCount: number | string;

  // Historial
  historyRecent: IncidentHistoryResponse[];

  // Métricas de tiempo
  openDays: number | null;
  pendingDays: number | null;

  // Auditoría básica
  createdAt: string; // ISO 8601 Date string
  updatedAt: string; // ISO 8601 Date string
}
