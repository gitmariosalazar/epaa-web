export interface InventoryResponse {
  inventoryId: number;
  companyCode: string | null;
  accountCode: string | null;
  itemCode: string | null;
  itemName: string | null;
  itemStatus: string | null;
  minStock: number | null;
  currentStock: number | null;
  itemLevel: number | null;
  avgCostValue: number | null;
  itemType: string | null;
  unitOfMeasure: string | null;
  vatApplicable: string | null;
  previousCode: string | null;
}
