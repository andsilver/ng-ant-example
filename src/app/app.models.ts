export interface Filter {
  last_name: string;
  first_name: string;
  address: string;
  sort_by: string;
  sort_order: string;
  offset: number;
  limit: number;
}

export interface NaturalPerson {
  id: number;
  lastName: string;
  firstName: string;
  address: string;
}

export interface PersonModel {
  lastName: string;
  firstName: string;
  registrationNumber: string;
  gender: string;
  civilStatus: string;
  dateOfBirth: Date;
  dateOfDeath: Date;
  residentialAddress: Object;
  correspondenceAddress: 	Object;
}
