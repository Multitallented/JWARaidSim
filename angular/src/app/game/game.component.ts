import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import {ArmyListService} from "./army-list.service";
import {Platoon} from "./models/platoon";
import {Squad} from "./models/squad";
import {Faction} from "./models/faction";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  providers: [Platoon, Squad, Faction]
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
  faction: Faction;
  selectedFaction: Faction;
  factionList: Array<Faction>;

  armyList: Array<Platoon> = [];

  ngOnInit() {
    let hash = window.location.hash;
    if (!hash || hash.length < 1 || hash.indexOf('/') < 0) {
      return;
    }
    let navVars = hash.split('/');
    if (navVars.length < 3) {
      return;
    }
    this.selectNation(navVars[2]);
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
    this.faction = null;
    this.selectedFaction = null;
    this.factionList = this.armyListService.getFactions(nation);
    let platoons = this.armyListService.getPlatoons(nation);
    for (let platoon of platoons) {
      this.loadPlatoon(platoon);
    }
    if (this.factionList.length < 1) {
      window.location.hash = '#/game/' + nation;
    } else if (this.factionList.length < 2) {
      this.faction = this.factionList[0];
      window.location.hash = '#/game/' + nation + "/" + this.faction.name.toLowerCase().replace(' ', '_');
    }
  }

  selectFaction(faction) {
    this.faction = faction;
    this.selectedFaction = null;
  }

  getPlatoonOptions(): Array<Platoon> {
    let returnPlatoons = new Array<Platoon>();
    for (let platoon of this.platoonOptions) {
      if (platoon.data.options > -1 && (this.armyList.length > 0 || platoon.data.standard)) {
        if (!platoon.data.factions || platoon.data.factions.indexOf(this.faction.name) !== -1) {
          returnPlatoons.push(platoon);
        }
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
    this.selectedFaction = null;
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
      if (squadData.modifiers) {
        squad.modifiers = _.cloneDeep(squadData.modifiers);
      }
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

  getCardIcon(type: string): string {
    switch (this.nation) {
      default:
      case 'german':
        return type === 'infantry' ?
          '../../assets/germans/helmet.png' : '../../assets/germans/pz4.png';
    }
  }

  replaceIcons(input:string): string {
    let commonIcons = [ 'angle', 'blast', 'shots', 'close-combat', 'damage',
        'hit-armor', 'hit-infantry', 'hp', 'infantry-defense', 'knife',
        'morale', 'move', 'radio', 'range', 'runner', 'shout', 'turret', 'vehicle-defense'];
    for (let icon of commonIcons) {
      input = input.replace('$' + icon + '$', '<img class="stat-icon" src="assets/common/' + icon + '.png" alt="' + icon + '" />');
    }
    return input;
  }

  getFactionPoints(): number {
    let points = this.getPoints();
    if (this.faction == null) {
      return points;
    }
    return Math.round(points - (points / this.faction.pointModifier));
  }

  getValue(key, baseValue): number {
    let returnValue = baseValue;
    if (this.activeSquad.modifiers[key]) {
      returnValue += this.activeSquad.modifiers[key];
    }
    if (this.faction.modifiers[key]) {
      returnValue += this.faction.modifiers[key];
    }
    return Math.max(0, returnValue);
  }

  getSpecials(key, baseValue): Array<string> {
    let returnValue = [];
    for (let line of baseValue) {
      if (!line || (this.activeSquad.modifiers[key] &&
          this.activeSquad.modifiers[key].indexOf(line) !== -1)) {
        continue;
      }
      returnValue.push(line);
    }
    return returnValue;
  }

  toggleVariant(variant: any, unlocking: boolean) {
    let unlocks = variant.unlocks ? variant.unlocks : 0;
    if (unlocking && ((unlocks === 0 && !variant.max) || unlocks < variant.max)) {
      if (this.validateVariant(variant)) {
        this.unlockVariant(variant);
        if (!variant.unlocks) {
          variant.unlocks = 1;
        } else {
          variant.unlocks++;
        }
      }

    } else if (!unlocking && variant.unlocks > 0) {
      this.lockVariant(variant);
      variant.unlocks--;
    }
  }

  private validateVariant(variant): boolean {
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.weapons) {
          if (!this.hasWeapons(variant.remove.infantry.weapons)) {
            return false;
          }
        }
      }
    }
    if (variant.require) {
      if (variant.require.type === 'squad') {
        let numberOfSquads = 0;
        for (let squad of this.activePlatoon.squads) {
          if (squad.name === variant.require.name) {
            numberOfSquads++;
          }
        }
        if (numberOfSquads < 1 && variant.require.max < 1) {
          return false;
        }
        if (variant.require.max > 0 && variant.require.max <= numberOfSquads) {
          return false;
        }
      }
    }
    return true;
  }

  private lockVariant(variant: any) {
    if (variant.modifiers) {
      for (let key of Object.keys(variant.modifiers)) {
        let modifierAmt = variant.modifiers[key];
        if (this.activeSquad.modifiers[key] && this.activeSquad.modifiers[key] - modifierAmt === 0) {
          delete this.activeSquad.modifiers[key];
        } else if (this.activeSquad.modifiers[key] > modifierAmt) {
          this.activeSquad.modifiers[key] = this.activeSquad.modifiers[key] - modifierAmt;
        }
      }
    }
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
          this.removeWeapons(variant.add.infantry.weapons);
        }
        if (variant.add.infantry.models) {
          this.activeSquad.data.infantry[variant.add.infantry.models.group].models += variant.add.infantry.models.qty;
        }
      }
    }
    if (variant.comms) {
      delete this.activeSquad.data[variant.comms.type];
    }
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.models) {
          this.activeSquad.data.infantry[variant.remove.infantry.models.group].models += variant.remove.infantry.models.qty;
        }
        if (variant.remove.infantry.weapons) {
          this.addWeapons(variant.remove.infantry.weapons);
        }
      }
    }
    this.activeSquad.points -= variant.points;
  }

  private unlockVariant(variant: any) {
    this.activeSquad.points += variant.points;
    if (variant.modifiers) {
      for (let key of Object.keys(variant.modifiers)) {
        if (this.activeSquad.modifiers[key]) {
          this.activeSquad.modifiers[key] += variant.modifiers[key];
        } else {
          this.activeSquad.modifiers[key] = variant.modifiers[key];
        }
      }
    }
    if (variant.add) {
      if (variant.add.squad) {
        for (let key in variant.add.squad) {
          if (!key || !variant.add.squad.hasOwnProperty(key)) {
            continue;
          }
          let squad = _.cloneDeep(this.squadMap[key]);
          squad.included = true;
          this.activePlatoon.squads.push(squad);
        }
      }
      if (variant.add.infantry) {
        if (variant.add.infantry.weapons) {
          this.addWeapons(variant.add.infantry.weapons);
        }
        if (variant.add.infantry.models) {
          this.activeSquad.data.infantry[variant.add.infantry.models.group].models += variant.add.infantry.models.qty;
        }
      }
    }
    if (variant.comms) {
      this.activeSquad.data[variant.comms.type] = variant.comms.value;
    }
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.models) {
          this.activeSquad.data.infantry[variant.remove.infantry.models.group].models -= variant.remove.infantry.models.qty;
        }
        if (variant.remove.infantry.weapons) {
          this.removeWeapons(variant.remove.infantry.weapons);
        }
      }
    }
  }


  private removeWeapons(weaponsToRemove) {
    for (let weaponRemove of weaponsToRemove) {
      let i = 0;
      for (let weapon of this.activeSquad.data.infantry[weaponRemove.group].weapons) {
        if (weapon.name === weaponRemove.name) {
          if (weapon.qty > weaponRemove.qty) {
            weapon.qty -= weaponRemove.qty;
            i = this.activeSquad.data.infantry[weaponRemove.group].weapons.length;
          }
          break;
        }
        i++;
      }
      if (this.activeSquad.data.infantry[weaponRemove.group].weapons.length > 0 &&
        this.activeSquad.data.infantry[weaponRemove.group].weapons.length > i) {
        this.activeSquad.data.infantry[weaponRemove.group].weapons.splice(i, 1);
      }
    }
  }

  private addWeapons(weaponsToAdd) {
    for (let weaponAdd of weaponsToAdd) {
      let hasWeapon = -1;
      let i = 0;
      for (let weapon of this.activeSquad.data.infantry[weaponAdd.group].weapons) {
        if (weapon.name === weaponAdd.name) {
          hasWeapon = i;
          break;
        }
        i++;
      }
      if (hasWeapon > -1) {
        this.activeSquad.data.infantry[weaponAdd.group].weapons[hasWeapon].qty += weaponAdd.qty;
      } else {
        this.activeSquad.data.infantry[weaponAdd.group].weapons.push(_.cloneDeep(weaponAdd));
      }
    }
  }

  private hasWeapons(weapons): boolean {
    for (let weapon of weapons) {
      let hasWeapon = false;
      for (let squadWeapon of this.activeSquad.data.infantry[weapon.group].weapons) {
        if (squadWeapon.name === weapon.name) {
          if (weapon.qty <= squadWeapon.qty) {
            hasWeapon = true;
          }
          break;
        }
      }
      if (!hasWeapon) {
        return false;
      }
    }
    return true;
  }
}
