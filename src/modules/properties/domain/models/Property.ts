export interface Property {
  propertyId: string;
  propertyCadastralKey: string;
  propertyClientId: string;
  propertyAlleyway: string;
  propertySector: string;
  propertyAddress: string;
  propertyLandArea: number;
  propertyConstructionArea: number;
  propertyLandValue: number;
  propertyConstructionValue: number;
  propertyCommercialValue: number;
  propertyCoordinates: string;
  propertyReference: string;
  propertyAltitude: number;
  propertyPrecision: number;
  propertyTypeId: number;
  propertyTypeName: string;
}

export interface PropertyByType {
  tipoPredioId: number;
  propertyType: string;

  // Volume and Distribution
  totalProperties: number;
  percentageOfTotal: number;

  // Areas
  totalLandAreaM2: number;
  totalBuiltAreaM2: number;
  avgLandAreaM2: number;
  avgBuiltAreaM2: number;

  // Land Use Ratio (Floor Area Ratio)
  avgFloorAreaRatio: number;

  // Weighted Unit Prices (Most Important)
  weightedPricePerM2Land: number;
  weightedPricePerM2Built: number;

  // Commercial / Financial Value
  totalPortfolioValue: number;
  avgPropertyValue: number;
  medianPropertyValue: number;

  // Data Quality Alerts
  percentageWithoutCoordinates: number;
  alertsMissingConstructionValue: number;
  propertiesWithBuiltAreaExceedingLand: number;
}
