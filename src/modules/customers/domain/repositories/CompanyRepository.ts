import type { Company } from '../models/Company';

// DTO for Creating/Updating Companies (API expects string arrays, not object arrays)
export interface CreateCompanyRequest {
  companyName: string;
  socialReason: string;
  companyRuc: string;
  companyAddress: string;
  companyParishId: string;
  companyCountry: string;
  companyEmails: string[]; // API expects ["email1", "email2"]
  companyPhones: string[]; // API expects ["phone1", "phone2"]
  identificationType: string;
}

export interface CompanyRepository {
  getAll(limit: number, offset: number): Promise<Company[]>;
  getById(id: string): Promise<Company>;
  create(company: CreateCompanyRequest): Promise<void>;
  update(id: string, company: CreateCompanyRequest): Promise<void>;
  delete(id: string): Promise<void>;
}
