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
  immobile = false;
  tracked = false;
  checkboxes = {};

  constructor(name: string, included: boolean, points: number) {
    this.name = name;
    this.included = included;
    this.points = points;
  }

  cycleCheckbox(name: string) {
    if (!this.checkboxes[name] || this.checkboxes[name] === 'assets/common/checkbox.png') {
      this.checkboxes[name] = 'assets/common/downed.png';
    } else if (this.checkboxes[name] === 'assets/common/downed.png') {
      this.checkboxes[name] = 'assets/common/killed.png';
    } else {
      this.checkboxes[name] = 'assets/common/checkbox.png';
    }
  }

  cycleCheckboxBinary(name: string) {
    if (!this.checkboxes[name] || this.checkboxes[name] === 'assets/common/checkbox.png') {
      this.checkboxes[name] = 'assets/common/killed.png';
    } else {
      this.checkboxes[name] = 'assets/common/checkbox.png';
    }
  }

  getCheckboxSrc(name: string) {
    if (!this.checkboxes[name]) {
      return 'assets/common/checkbox.png';
    }
    return this.checkboxes[name];
  }

  getCharacteristics(): string {
    let returnString = '';
    if (!this.data.characteristics) {
      return 'None';
    }
    let i = 0;
    for (let characteristic of this.data.characteristics) {
      if (i !== 0) {
        returnString += ", ";
      }
      returnString += characteristic;
      i++;
    }
    if (this.modifiers['characteristics']) {
      for (let characteristic of this.modifiers['characteristics']) {
        if (i !== 0) {
          returnString += ", ";
        }
        returnString += characteristic;
        i++;
      }
    }
    if (i === 0) {
      return "None";
    }
    return returnString;
  }

  hasChassis(): boolean {
    if (!this.data.infantry) {
      return false;
    }
    for (let infantry of this.data.infantry) {
      if (infantry.name === 'Chassis') {
        return true;
      }
    }
    return false;
  }
}
