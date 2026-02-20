export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  emails: string[];
  phoneNumbers: string[];
  dateOfBirth: string | null; // ISO Date string
  sexId: number;
  civilStatus: number;
  address: string | null;
  professionId: number;
  originCountry: string | null;
  identificationType: string;
  parishId: string;
  deceased: boolean;
}
