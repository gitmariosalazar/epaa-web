export interface CountryResponse {
  countryId: string;
  countryName: string;
}

export interface ProvinceResponse {
  provinceId: string;
  provinceName: string;
  countryId: string;
}

export interface CantonResponse {
  cantonId: string;
  cantonName: string;
  provinceId: string;
}

export interface ParishTypeResponse {
  parishTypeId: string;
  parishTypeName: string;
}

export interface ParishResponse {
  parishId: string;
  parishName: string;
  cantonId: string;
  parishTypeId: string;
}

export interface CenterLocationResponse {
  centerLat: number;
  centerLng: number;
  countData: number;
}
