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
  img: string;
  lore: string;
  allies: Array<string> = [];
  nations: Array<string> = [];
  startDate: number;
  endDate: number;

  constructor(name: string, standardPlatoons: Array<string>, img: string,
              lore: string) {
    this.name = name;
    this.standardPlatoons = standardPlatoons;
    this.img = img;
    this.lore = lore;
  }

  getRoundedPoints(): string {
    return this.pointModifier > 1 ? '+' + Math.round((this.pointModifier - 1) * 100) :
      '-' + Math.round((this.pointModifier - 1) * 100);
  }

  getNations(): string {
    let returnString = '';
    let i = 0;
    for (let nation of this.nations) {
      if (i !== 0) {
        returnString += " - ";
      }
      returnString += nation;
      i++;
    }
    return returnString;
  }

  getAllies(): string {
    let returnString = '';
    let i = 0;
    for (let ally of this.allies) {
      if (i !== 0) {
        returnString += ", ";
      }
      returnString += ally;
      i++;
    }
    if (i === 0) {
      return "None";
    }
    return returnString;
  }
}
