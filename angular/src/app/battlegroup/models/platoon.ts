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
    let totalBr = 0;
    if (this.data.br) {
      totalBr -= this.data.br;
    }
    for (let squad of this.squads) {
      if (squad.included && squad.data.br) {
        totalBr += squad.data.br;
      }
    }
    return totalBr;
  }
}
