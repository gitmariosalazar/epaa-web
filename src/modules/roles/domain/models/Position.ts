export interface Position {
  positionId: number;
  name: string;
  levelJerarchy: number;
  description?: string;
  isActive: boolean;
  creationDate: Date;
  updatedAt: Date;
}
