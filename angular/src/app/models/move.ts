import {Effect} from "./effect";

export class Move {
  key: string;
  target: string;
  name: string;
  img: string;
  dmg: number;
  rend: boolean;
  priority: boolean;
  buffs: Array<Effect>;
  debuffs: Array<Effect>;
  threatened: number;
  threatenedMove: Move;
  pen: boolean;
  remove: Array<string>;
}
