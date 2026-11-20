export interface Sector {
  id: number;
  name: string;
}

let initialSector: number = 1;
let endSector: number = 40;

function getSectors(initialSector: number, endSector: number): Sector[] {
  const sectors: Sector[] = [];
  for (let i = initialSector; i <= endSector; i++) {
    sectors.push({ id: i, name: `Sector ${i}` });
  }
  return sectors;
}

export const sectors: Sector[] = [...getSectors(initialSector, endSector)];
