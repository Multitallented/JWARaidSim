import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import * as germanWeapons from '../units/german/weapons.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';

class Squad {
  name: string;
  included: boolean;
  points: number;
  editing: boolean;
  data: any;
  required: boolean = false;

  constructor(name: string, included: boolean, points: number) {
    this.name = name;
    this.included = included;
    this.points = points;
  }
}

class Platoon {
  name: string;
  editing: boolean;
  standard: boolean;
  expanded: boolean = true;
  squads: Array<Squad> = [];
  data: any;

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

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
})
export class GameComponent implements OnInit {

  constructor() {
  }

  nation: string;
  platoonOptions: Array<Platoon> = [];
  activeSquad: Squad;
  activePlatoon: Platoon;
  frontSide: boolean = true;
  squadMap: any = {};

  armyList: Array<Platoon> = [];

  ngOnInit() {
  }

  selectNation(nation:string) {
    this.nation = nation;
    this.platoonOptions = new Array<Platoon>();
    this.squadMap = {};
    this.activeSquad = null;
    this.activePlatoon = null;
    this.frontSide = true;
    this.armyList = [];
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

  viewSquad(squad: Squad, platoon: Platoon) {
    this.activePlatoon = platoon;
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
    let platoon = new Platoon(platoonData.name, platoonData.standard);
    platoon.data = platoonData;
    for (let key in platoonData.squads) {
      if (!key || !platoonData.squads.hasOwnProperty(key)) {
        continue;
      }
      let squadData = platoonData.squads[key];
      let min = 0;
      let squad = new Squad(key, squadData.min > min, squadData.points);
      squad.data = squadData;
      if (squadData.max === 0) {
        squad.required = true;
      }
      this.squadMap[key] = squad;
      for (let i = 0; i < squadData.max; i++) {
        let newSquad = _.cloneDeep(squad);
        if (i >= squadData.min) {
          newSquad.included = false;
        } else {
          newSquad.required = true;
        }
        platoon.squads.push(newSquad);
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
    let totalOptions = 0;
    let subFirstStandard = false;
    for (let platoon of this.armyList) {
      if (!subFirstStandard && platoon.standard) {
        totalOptions += platoon.data.options;
        subFirstStandard = true;
      }
      totalOptions += platoon.getOptions();
    }
    return totalOptions;
  }

  getCardIcon(fromSquad: Squad): string {
    switch (this.nation) {
      default:
      case 'german':
        return fromSquad.data.type === 'infantry' ?
          '../../assets/germans/helmet.png' : '../../assets/germans/pz4.png';
    }
  }

  replaceIcons(input:string): string {
    let commonIcons = [ 'angle', 'blast', 'shots', 'close-combat', 'damage',
        'hit-armor', 'hit-infantry', 'hp', 'infantry-defense', 'knife',
        'morale', 'move', 'radio', 'range', 'runner', 'shout', 'turret', 'vehicle-defense'];
    for (let icon of commonIcons) {
      input = input.replace('$' + icon + '$', '<img src="assets/common/' + icon + '.png" alt="' + icon + '" />');
    }
    return input;
  }

  toggleVariant(variant: any) {
    let unlocking = !variant.selected;
    if (unlocking) {
      this.activeSquad.points += variant.points;
      if (variant.add) {
        if (variant.add.squad) {
          for (let key in variant.add.squad) {
            if (!key || !variant.add.squad.hasOwnProperty(key)) {
              continue;
            }
            console.log(key);
            let squad = _.cloneDeep(this.squadMap[key]);
            squad.included = true;
            this.activePlatoon.squads.push(squad);
          }
        }
      }
    } else {
      if (variant.add) {
        if (variant.add.squad) {
          for (let key in variant.add.squad) {
            if (!key) {
              continue;
            }
            let i = 0;
            for (i = 0; i < this.activePlatoon.squads.length; i++) {
              if (this.activePlatoon.squads[i].name === key) {
                break;
              }
            }
            if (this.activePlatoon.squads.length > 0 && this.activePlatoon.squads.length > i) {
              this.activePlatoon.squads.splice(i, 1);
            }
          }
        }
      }
      this.activeSquad.points -= variant.points;
    }
    variant.selected = !variant.selected;
  }
}
