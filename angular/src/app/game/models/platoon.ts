import {Squad} from "./squad";
import {Injectable} from "@angular/core";

@Injectable()
export class Platoon {
  name: string;
  editing: boolean;
  standard: boolean;
  expanded: boolean = true;
  squads: Array<Squad> = [];
  data: any;
  max: number;

  constructor(name: string, standard: boolean) {
    this.name = name;
    this.standard = standard;
  }

  getPoints(): number {
    let pointTotal = 0;
    for (let squad of this.squads) {
      if (squad.included) {
        pointTotal += squad.points;
      }
    }
    return pointTotal;
  }

  getOptions(): number {
    let totalOptions = 0;
    if (this.data.options) {
      totalOptions -= this.data.options;
    }
    for (let squad of this.squads) {
      if (squad.included && squad.data.options) {
        totalOptions += squad.data.options;
      }
    }
    return totalOptions;
  }
}
