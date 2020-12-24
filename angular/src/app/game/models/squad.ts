import {Injectable} from "@angular/core";

@Injectable()
export class Squad {
  name: string;
  included: boolean;
  points: number;
  editing: boolean;
  data: any;
  required: boolean = false;
  modifiers = {};

  constructor(name: string, included: boolean, points: number) {
    this.name = name;
    this.included = included;
    this.points = points;
  }
}
