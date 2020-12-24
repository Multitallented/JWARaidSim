import {Injectable} from "@angular/core";

@Injectable()
export class Faction {
  name: string;
  standardPlatoons: Array<string>;
  specials: Array<string> = [ "None" ];
  pointModifier: number = 1
  tag: string;
  modifiers = {};
  abilities: Array<string> = [];

  constructor(name: string, standardPlatoons: Array<string>) {
    this.name = name;
    this.standardPlatoons = standardPlatoons;
  }
}
