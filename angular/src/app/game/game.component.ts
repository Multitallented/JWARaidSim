import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import * as germanWeapons from '../units/german/weapons.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';

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
  standard: boolean;
  squads: Array<Squad> = [];

  constructor(name: string, options: number, standard: boolean) {
    this.name = name;
    this.options = options;
    this.standard = standard;
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

  constructor() {
  }

  germans = {};
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
    this.loadPlatoon(germanGrenadiers)
  }

  setAmerican() {

  }

  loadPlatoon(platoonData: any) {
    platoonData = platoonData.default;
    console.log(platoonData)
    let platoon = new Platoon(platoonData.name, platoonData.options, platoonData.standard);
    for (let key in platoonData.squads) {
      if (!key || !platoonData.squads.hasOwnProperty(key)) {
        continue;
      }
      let squadData = platoonData.squads[key];
      let min = 0;
      for (let i = 0; i < squadData.max; i++) {
        let squad = new Squad(key, squadData.min > min, squadData.points);
        platoon.squads.push(squad);
        min++;
      }
    }
    this.platoonOptions.push(platoon);
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
