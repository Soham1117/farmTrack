import { Farm } from './farm.model';

export interface Movement {
  movementId: number;
  originFarm: Farm;
  destinationFarm: Farm;
  numItemsMoved: number;
}
