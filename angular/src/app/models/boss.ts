import {Move} from "./move";
import {Resistances} from "./resistances";
import {Injectable} from "@angular/core";

@Injectable()
export class Boss {
  name: string;
  img: string;
  minions:Array<Boss>;
  hp: number;
  dmg: number;
  speed: number;
  armor: number;
  crit: number;
  resistances: Resistances;
  counter: string;
  moveset: Array<Array<string>>;
}
