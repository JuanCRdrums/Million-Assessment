export interface Owner {
  id: string;
  name: string;
  address: string;
  photo: string;
  birthday?: string;
}

export interface PropertyImage {
  file: string;
  enabled: boolean;
}

export interface PropertyTrace {
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  owner: Owner;
  images: PropertyImage[];
  traces: PropertyTrace[];
}

export interface PropertyFilter {
  name?: string;
  address?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
}