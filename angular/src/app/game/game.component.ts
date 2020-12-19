import { Component, OnInit } from '@angular/core';
import _ from 'lodash';

class Squad {
  name: string;
  included: boolean;
  points: number;
  editing: boolean;
  options: number = -1;
  variants: Map<string, number> = new Map();

  constructor(name: string, included: boolean, points: number) {
    this.name = name;
    this.included = included;
    this.points = points;
  }
}

class Platoon {
  name: string;
  options: number;
  editing: boolean;
  squads: Array<Squad> = [];

  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  getPoints(): number {
    let pointTotal = 0;
    for (let squad of this.squads) {
      pointTotal += squad.points;
    }
    return pointTotal;
  }

  getOptions(): number {
    let totalOptions = -this.options;
    for (let squad of this.squads) {
      if (squad.included) {
        totalOptions -= squad.options;
      }
    }
    return totalOptions;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
})
export class GameComponent implements OnInit {

  constructor() { }

  nation: string;
  platoonOptions: Array<Platoon> = [];
  activeSquad: Squad;

  armyList: Array<Platoon> = [];

  ngOnInit() {
  }

  selectNation(nation:string) {
    this.nation = nation;
    if (nation === 'german') {
      this.setGerman();
    } else if (nation === 'american') {
      this.setAmerican();
    }
  }

  addPlatoon(platoon: Platoon) {
    // TODO validate options
    this.armyList.push(_.cloneDeep(platoon));
  }

  viewSquad(squad: Squad) {
    this.activeSquad = squad;
  }

  setGerman() {
    let grenadierPlatoon = new Platoon('Grenadiers', 1);
    grenadierPlatoon.squads.push(new Squad('Grenadier Command', false, 100));
    grenadierPlatoon.squads.push(new Squad('Grenadier', true, 150));
    grenadierPlatoon.squads.push(new Squad('Grenadier', true, 150));
    grenadierPlatoon.squads.push(new Squad('Grenadier', false, 150));
    this.platoonOptions.push(grenadierPlatoon);
  }

  setAmerican() {

  }

  getPoints(): number {
    let totalPoints = 0;
    for (let platoon of this.armyList) {
      totalPoints += platoon.getPoints();
    }
    return totalPoints;
  }
  getOptions(): number {
    let totalOptions = 2;
    for (let platoon of this.armyList) {
      totalOptions += platoon.getOptions();
    }
    return totalOptions;
  }
}
