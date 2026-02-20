export interface CustomerEmail {
  correo: string;
  correo_electronico_id?: number;
}

export interface CustomerPhone {
  numero: string;
  telefono_id?: number;
}

export interface GeneralCustomer {
  customerId: string;
  identificationType: string;
  customerName: string;
  emails: (string | CustomerEmail)[];
  phoneNumbers: (string | CustomerPhone)[];
  customerAddress: string;
}
