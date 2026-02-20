export interface CompanyEmail {
  correo: string;
  correo_electronico_id: number;
}

export interface CompanyPhone {
  numero: string;
  telefono_id: number;
}

export interface Company {
  companyId: string;
  companyName: string | null;
  socialReason: string | null;
  companyRuc: string;
  companyAddress: string | null;
  companyParishId: string;
  companyCountry: string | null;
  companyEmails: CompanyEmail[];
  companyPhones: CompanyPhone[];
  identificationType: string;
}
