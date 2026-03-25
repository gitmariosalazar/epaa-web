import type { Customer } from '../models/Customer';

export interface CreateCustomerRequest {
  customerId: number;
  firstName: string;
  lastName: string;
  emails: string[];
  phoneNumbers: string[];
  dateOfBirth: Date;
  sexId: number;
  civilStatus: number;
  address: string;
  professionId: number;
  originCountry: string;
  identificationType: string;
  parishId: string;
  deceased?: boolean;
}

export interface UpdateCustomerRequest {
  customerId: number;
  firstName: string;
  lastName: string;
  emails: string[];
  phoneNumbers: string[];
  dateOfBirth: Date;
  sexId: number;
  civilStatus: number;
  address: string;
  professionId: number;
  originCountry: string;
  identificationType: string;
  parishId: string;
  deceased?: boolean;
}

export interface CustomerRepository {
  getAll(limit: number, offset: number): Promise<Customer[]>;
  getById(id: string): Promise<Customer>;
  create(customer: CreateCustomerRequest): Promise<void>;
  update(id: string, customer: UpdateCustomerRequest): Promise<void>;
  delete(id: string): Promise<void>;
  findByIdentification(identification: string): Promise<Customer | null>;
}
