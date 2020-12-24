import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import {ArmyListService} from "./army-list.service";
import {Platoon} from "./models/platoon";
import {Squad} from "./models/squad";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  providers: [Platoon, Squad]
})
export class GameComponent implements OnInit {
  private armyListService: ArmyListService;

  constructor(armyListService: ArmyListService) {
    this.armyListService = armyListService;
  }

  nation: string;
  platoonOptions: Array<Platoon> = [];
  activeSquad: Squad;
  activePlatoon: Platoon;
  frontSide: boolean = true;
  squadMap: any = {};
  weaponMap: any = {};

  armyList: Array<Platoon> = [];

  ngOnInit() {
  }

  selectNation(nation:string) {
    this.nation = nation;
    this.platoonOptions = new Array<Platoon>();
    this.squadMap = {};
    this.weaponMap = this.armyListService.getWeapons(nation);
    this.activeSquad = null;
    this.activePlatoon = null;
    this.frontSide = true;
    this.armyList = [];
    let platoons = this.armyListService.getPlatoons(nation);
    for (let platoon of platoons) {
      this.loadPlatoon(platoon);
    }
  }

  getPlatoonOptions(): Array<Platoon> {
    let returnPlatoons = new Array<Platoon>();
    for (let platoon of this.platoonOptions) {
      if (platoon.data.options > -1 && (this.armyList.length > 0 || platoon.data.standard)) {
        returnPlatoons.push(platoon);
      }
    }
    return returnPlatoons;
  }

  addPlatoon(platoon: Platoon) {
    // TODO validate options
    this.armyList.push(_.cloneDeep(platoon));
  }

  viewSquad(squad: Squad, platoon: Platoon) {
    this.activePlatoon = platoon;
    this.activeSquad = squad;
  }

  loadPlatoon(platoonData: any) {
    platoonData = platoonData.default;
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
      this.unlockVariant(variant);
    } else {
      this.lockVariant(variant);
    }
    variant.selected = !variant.selected;
  }

  private lockVariant(variant: any) {
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
      if (variant.add.infantry) {
        if (variant.add.infantry.weapons) {
          for (let weaponAdd of variant.add.infantry.weapons) {
            let i = 0;
            for (let weapon of this.activeSquad.data.infantry[weaponAdd.group].weapons) {
              if (weapon.name === weaponAdd.name) {
                break;
              }
              i++;
            }
            if (this.activeSquad.data.infantry[weaponAdd.group].weapons.length > 0 &&
                this.activeSquad.data.infantry[weaponAdd.group].weapons.length > i) {
              this.activeSquad.data.infantry[weaponAdd.group].weapons.splice(i, 1);
            }
          }
        }
        if (variant.add.infantry.models) {
          this.activeSquad.data.infantry[variant.add.infantry.models.group] += variant.add.infantry.models.qty;
        }
      }
    }
    this.activeSquad.points -= variant.points;
  }

  private unlockVariant(variant: any) {
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
      if (variant.add.infantry) {
        if (variant.add.infantry.weapons) {
          for (let weaponAdd of variant.add.infantry.weapons) {
            this.activeSquad.data.infantry[weaponAdd.group].weapons.push(weaponAdd);
          }
        }
        if (variant.add.infantry.models) {
          this.activeSquad.data.infantry[variant.add.infantry.models.group] += variant.add.infantry.models.qty;
        }
      }
    }
  }
}
