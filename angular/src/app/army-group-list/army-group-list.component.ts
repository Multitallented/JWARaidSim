import {Component, Input, OnInit} from '@angular/core';
import _ from 'lodash';
import {ArmyListService} from "./army-list.service";
import {Platoon} from "../game/models/platoon";
import {Squad} from "../game/models/squad";
import {Faction} from "../game/models/faction";

@Component({
  selector: 'app-army-group-list',
  templateUrl: './army-group-list.component.html',
  styleUrls: ['./army-group-list.component.sass'],
  providers: [Platoon, Squad, Faction]
})
export class ArmyGroupListComponent implements OnInit {

  private armyListService: ArmyListService;

  constructor(armyListService: ArmyListService) {
    this.armyListService = armyListService;
  }

  @Input("nation") public nation: string;

  platoonOptions: Array<Platoon> = [];
  activeSquad: Squad;
  activePlatoon: Platoon;
  frontSide: boolean = true;
  squadMap: any = {};
  weaponMap: any = {};
  faction: Faction;
  selectedFaction: Faction;
  factionList: Array<Faction> = [];

  armyList: Array<Platoon> = [];

  ngOnInit() {
    if (this.nation) {
      this.selectNation(this.nation);
    }
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
      this.selectFaction(this.factionList[0]);
      window.location.hash = '#/game/' + nation + "/" + this.faction.name.toLowerCase().split(' ').join('_');
    }
  }

  selectFaction(faction) {
    this.faction = faction;
    this.selectedFaction = null;
    let platoonOptions = this.getPlatoonOptions();
    if (platoonOptions.length === 1) {
      this.addPlatoon(platoonOptions[0]);
    }
    window.location.hash = '#/game/' + this.nation + "/" + this.faction.name.toLowerCase().split(' ').join('_');
  }

  getPlatoonOptions(): Array<Platoon> {
    let returnPlatoons = new Array<Platoon>();
    for (let platoon of this.platoonOptions) {
      if (platoon.data.options > -1 && (this.armyList.length > 0 || platoon.data.standard) &&
        !this.isAtMax(platoon) && (this.armyList.length < 1 || this.getOptions() >= this.getMinOptions(platoon))) {
        if (!platoon.data.factions || platoon.data.factions.indexOf(this.faction.name) !== -1) {
          returnPlatoons.push(platoon);
        }
      }
    }
    return returnPlatoons;
  }

  getMinOptions(platoon: Platoon): number {
    let options = platoon.data.options;
    for (let squad of platoon.squads) {
      if (squad.data.options && squad.included) {
        options -= squad.data.options;
      }
    }
    return options;
  }

  isAtMax(platoon: Platoon): boolean {
    let max = platoon.max;
    if (!max) {
      return false;
    }
    let count = 0;
    for (let cPlatoon of this.armyList) {
      if (platoon.name === cPlatoon.name || (platoon.data.group && cPlatoon.data.group &&
          platoon.data.group === cPlatoon.data.group)) {
        count++;
      }
    }
    return count >= max;
  }

  addPlatoon(platoon: Platoon) {
    let newPlatoon = _.cloneDeep(platoon);
    newPlatoon.squads.forEach(squad => {
      if (squad.data.variants && squad.included) {
        for (let variant of squad.data.variants) {
          if (variant.required && (!variant.factions || variant.factions.indexOf(this.faction.name) !== -1)) {
            this.unlockVariant(variant, squad, newPlatoon);
          }
        }
      }
    })
    this.armyList.push(newPlatoon);
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
    if (platoonData.max) {
      platoon.max = platoonData.max;
    }
    for (let key in platoonData.squadLinks) {
      if (!key || !platoonData.squadLinks.hasOwnProperty(key)) {
        continue;
      }
      let squadData = platoonData.squadLinks[key];
      let squad = _.cloneDeep(this.squadMap[key]);
      squad = _.merge(squadData, squad);

      for (let i = 0; i < squadData.max; i++) {
        let newSquad = _.cloneDeep(squad);
        platoon.squads.push(newSquad);
        if (i >= squadData.min) {
          newSquad.included = false;
        } else {
          newSquad.included = true;
          newSquad.required = true;
          this.addSquad(platoon, newSquad);
        }
      }
    }
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
        platoon.squads.push(newSquad);
        if (i >= squadData.min) {
          newSquad.included = false;
        } else {
          newSquad.included = true;
          newSquad.required = true;
          this.addSquad(platoon, newSquad);
        }
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
      case 'french':
        return type === 'infantry' ?
          '../../assets/french/f-helmet.png' : '../../assets/french/f-tank.png';
      case 'american':
        return type === 'infantry' ?
          '../../assets/american/a-helmet.png' : '../../assets/american/a-tank.png';
      case 'japanese':
        return type === 'infantry' ?
          '../../assets/japan/helmet.png' : '../../assets/japan/tank.png';
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

  dupePlatoon(platoon: Platoon) {
    this.armyList.push(_.cloneDeep(platoon));
  }

  removePlatoon(platoon: Platoon) {
    let index = this.armyList.indexOf(platoon);
    if (index !== -1) {
      this.armyList.splice(index, 1);
    }
  }

  addSquad(platoon, squad) {
    squad.included = true;
    if (squad.data.alsoAdd) {
      for (let squadName of squad.data.alsoAdd) {
        if (!squadName) {
          continue;
        }
        let newSquad = _.cloneDeep(this.squadMap[squadName]);
        newSquad.included = true;
        platoon.squads.push(newSquad);
      }
    }
    if (squad.data.variants && this.faction) {
      for (let variant of squad.data.variants) {
        if (variant.required && (!variant.factions || variant.factions.indexOf(this.faction.name) !== -1)) {
          this.unlockVariant(variant, squad, platoon);
        }
      }
    }
  }

  removeSquad(platoon, squad) {
    squad.included = false;
    if (squad.data.alsoAdd) {
      for (let squadName of squad.data.alsoAdd) {
        if (!squadName) {
          continue;
        }
        let i = 0;
        let squadFound = false;
        for (let cSquad of platoon.squads) {
          if (cSquad.name === squadName) {
            squadFound = true;
            break;
          }
          i++;
        }
        if (squadFound) {
          platoon.squads.splice(i, 1);
        }
      }
    }
    if (squad.data.variants && this.faction) {
      for (let variant of squad.data.variants) {
        if (variant.required && (!variant.factions || variant.factions.indexOf(this.faction.name) !== -1)) {
          this.lockVariant(variant, squad, platoon);
        }
      }
    }
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
    return returnValue;
  }

  getSpecials(key, baseValue): Array<string> {
    let returnValue = [];
    let dontAdd = [];
    for (let line of baseValue) {
      if (!line || (this.activeSquad.modifiers[key] &&
        this.activeSquad.modifiers[key].indexOf(line) !== -1)) {
        dontAdd.push(line);
        continue;
      }
      returnValue.push(line);
    }
    if (this.activeSquad.modifiers[key]) {
      for (let newLine of this.activeSquad.modifiers[key]) {
        if (!newLine || dontAdd.indexOf(newLine) !== -1) {
          continue;
        }
        returnValue.push(newLine);
      }
    }
    return returnValue;
  }

  toggleVariant(variant: any, unlocking: boolean, squad, platoon) {
    let unlocks = variant.unlocks ? variant.unlocks : 0;
    if (unlocking && ((unlocks === 0 && !variant.max) || unlocks < variant.max)) {
      if (variant.wholePlatoon) {
        for (let cSquad of platoon.squads) {
          if (!cSquad.data.variants || !cSquad.included) {
            continue;
          }
          for (let cVariant of cSquad.data.variants) {
            if (cVariant.name === variant.name) {
              if (this.validateVariant(cVariant, cSquad, platoon)) {
                this.unlockVariant(cVariant, cSquad, platoon);
                if (!variant.unlocks) {
                  cVariant.unlocks = 1;
                } else {
                  cVariant.unlocks++;
                }
              }
            }
          }
        }
      } else {
        if (this.validateVariant(variant, squad, platoon)) {
          this.unlockVariant(variant, squad, platoon);
          if (!variant.unlocks) {
            variant.unlocks = 1;
          } else {
            variant.unlocks++;
          }
        }
      }

    } else if (!unlocking && variant.unlocks > 0) {
      if (variant.wholePlatoon) {
        for (let cSquad of platoon.squads) {
          if (!cSquad.data.variants || !cSquad.included) {
            continue;
          }
          for (let cVariant of cSquad.data.variants) {
            if (cVariant.name === variant.name) {
              this.lockVariant(cVariant, cSquad, platoon);
              if (cVariant.unlocks) {
                cVariant.unlocks--;
              } else {
                cVariant.unlocks = 0;
              }
            }
          }
        }
      } else {
        this.lockVariant(variant, squad, platoon);
        variant.unlocks--;
      }
    }
  }

  private validateVariant(variant, squad, platoon): boolean {
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.weapons) {
          if (!this.hasWeapons(variant.remove.infantry.weapons, squad, platoon)) {
            return false;
          }
        }
      }
      if (variant.remove.squad) {
        for (let key of Object.keys(variant.remove.squad)) {
          if (!key) {
            continue;
          }
          let squadFound = false;
          let foundCount = 0;
          for (let cSquad of platoon.squads) {
            if (cSquad.name === key) {
              foundCount++;
              if (foundCount >= variant.remove.squad[key]) {
                squadFound = true;
                break;
              }
            }
          }
          if (!squadFound) {
            return false;
          }
        }
      }
    }
    if (variant.require) {
      if (variant.require.type === 'squad') {
        let numberOfSquads = 0;
        for (let currentSquad of platoon.squads) {
          if (currentSquad.name === variant.require.name) {
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
      if (variant.require.type === 'variant') {
        if (variant.require.max) {
          let numberOfVariants = 0;
          for (let cSquad of platoon.squads) {
            if (cSquad.data.variants) {
              for (let cVariant of cSquad.data.variants) {
                if (cVariant.name === variant.require.name && cVariant.unlocks) {
                  numberOfVariants++;
                }
              }
            }
          }
          if (numberOfVariants >= variant.require.max) {
            return false;
          }
        } else {
          let hasUnlock = false;
          for (let cVariant of squad.data.variants) {
            if (cVariant.name === variant.require.name && cVariant.unlocks > 0) {
              hasUnlock = true;
              break;
            }
          }
          if (!hasUnlock) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private lockVariant(variant: any, squad, platoon) {
    if (variant.modifiers) {
      for (let key of Object.keys(variant.modifiers)) {
        let modifierAmt = variant.modifiers[key];
        if (!(squad.modifiers[key] instanceof Number)) {
          delete squad.modifiers[key];
        } else if (squad.modifiers[key] && squad.modifiers[key] - modifierAmt === 0) {
          delete squad.modifiers[key];
        } else if (squad.modifiers[key] > modifierAmt) {
          squad.modifiers[key] = squad.modifiers[key] - modifierAmt;
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
          for (i = 0; i < platoon.squads.length; i++) {
            if (platoon.squads[i].name === key) {
              break;
            }
          }
          if (platoon.squads.length > 0 && platoon.squads.length > i) {
            platoon.squads.splice(i, 1);
          }
        }
      }
      if (variant.add.infantry) {
        if (variant.add.infantry.weapons) {
          this.removeWeapons(variant.add.infantry.weapons, squad, platoon);
        }
        if (variant.add.infantry.models) {
          squad.data.infantry[variant.add.infantry.models.group].models += variant.add.infantry.models.qty;
        }
      }
      if (variant.add.abilities) {
        this.toggleAbilities(variant.add.abilities, squad, platoon);
      }
    }
    if (variant.comms) {
      delete squad.data[variant.comms.type];
    }
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.models) {
          squad.data.infantry[variant.remove.infantry.models.group].models += variant.remove.infantry.models.qty;
        }
        if (variant.remove.infantry.weapons) {
          this.addWeapons(variant.remove.infantry.weapons, squad, platoon);
        }
      }
      if (variant.remove.squad) {
        for (let key of Object.keys(variant.remove.squad)) {
          if (!key) {
            continue;
          }
          let removeCount = variant.remove.squad[key];
          for (let i = 0; i < removeCount; i++) {
            let newSquad = _.cloneDeep(this.squadMap[key]);
            newSquad.included = true;
            platoon.squads.push(newSquad);
          }
        }
      }
    }
    squad.points -= variant.points;
  }

  getPlatoonCount(platoonName: string): number {
    let count = 0;
    for (let platoon of this.armyList) {
      if (platoon.name === platoonName) {
        count++;
      }
    }
    return count;
  }

  private unlockVariant(variant: any, squad: Squad, platoon: Platoon) {
    squad.points += variant.points;
    if (variant.modifiers) {
      for (let key of Object.keys(variant.modifiers)) {
        if (squad.modifiers[key]) {
          squad.modifiers[key] += variant.modifiers[key];
        } else {
          squad.modifiers[key] = variant.modifiers[key];
        }
      }
    }
    if (variant.remove) {
      if (variant.remove.infantry) {
        if (variant.remove.infantry.models) {
          squad.data.infantry[variant.remove.infantry.models.group].models -= variant.remove.infantry.models.qty;
        }
        if (variant.remove.infantry.weapons) {
          this.removeWeapons(variant.remove.infantry.weapons, squad, platoon);
        }
      }
      if (variant.remove.squad) {
        for (let key of Object.keys(variant.remove.squad)) {
          if (!key) {
            continue;
          }
          let removeCount = variant.remove.squad[key];
          do {
            let i = 0;
            let foundSquad = false;
            for (let cSquad of platoon.squads) {
              if (cSquad.name === key) {
                foundSquad = true;
                break;
              }
              i++;
            }
            if (!foundSquad) {
              break;
            } else {
              platoon.squads.splice(i, 1);
              removeCount--;
            }
          } while (removeCount > 0);
        }
      }
    }
    if (variant.add) {
      if (variant.add.squad) {
        for (let key in variant.add.squad) {
          if (!key || !variant.add.squad.hasOwnProperty(key)) {
            continue;
          }
          let newSquad = _.cloneDeep(this.squadMap[key]);
          newSquad.included = true;
          platoon.squads.push(newSquad);
        }
      }
      if (variant.add.infantry) {
        if (variant.add.infantry.weapons) {
          this.addWeapons(variant.add.infantry.weapons, squad, platoon);
        }
        if (variant.add.infantry.models) {
          squad.data.infantry[variant.add.infantry.models.group].models += variant.add.infantry.models.qty;
        }
      }
      if (variant.add.abilities) {
        this.toggleAbilities(variant.add.abilities, squad, platoon);
      }
    }
    if (variant.comms) {
      squad.data[variant.comms.type] = variant.comms.value;
    }
  }

  private toggleAbilities(abilities, squad: Squad, platoon: Platoon) {
    if (!squad.data.abilities) {
      squad.data.abilities = [];
    }
    for (let ability of abilities) {
      if (!ability) {
        continue;
      }
      let abilityIndex = squad.data.abilities.indexOf(ability);
      if (abilityIndex === -1) {
        squad.data.abilities.push(ability);
      } else {
        squad.data.abilities.splice(abilityIndex, 1);
      }
    }
  }

  getVariants(squad: Squad) {
    let returnVariants = [];
    if (!squad.data.variants) {
      return returnVariants;
    }
    for (let variant of squad.data.variants) {
      if (!variant.required && (!variant.factions || variant.factions.indexOf(this.faction.name) !== -1)) {
        returnVariants.push(variant);
      }
    }
    return returnVariants;
  }

  private removeWeapons(weaponsToRemove, squad: Squad, platoon: Platoon) {
    for (let weaponRemove of weaponsToRemove) {
      let i = 0;
      for (let weapon of squad.data.infantry[weaponRemove.group].weapons) {
        if (weapon.name === weaponRemove.name) {
          if (weapon.qty > weaponRemove.qty) {
            weapon.qty -= weaponRemove.qty;
            i = squad.data.infantry[weaponRemove.group].weapons.length;
          }
          break;
        }
        i++;
      }
      if (squad.data.infantry[weaponRemove.group].weapons.length > 0 &&
        squad.data.infantry[weaponRemove.group].weapons.length > i) {
        squad.data.infantry[weaponRemove.group].weapons.splice(i, 1);
      }
    }
  }

  private addWeapons(weaponsToAdd, squad: Squad, platoon: Platoon) {
    for (let weaponAdd of weaponsToAdd) {
      let hasWeapon = -1;
      let i = 0;
      for (let weapon of squad.data.infantry[weaponAdd.group].weapons) {
        if (weapon.name === weaponAdd.name) {
          hasWeapon = i;
          break;
        }
        i++;
      }
      if (hasWeapon > -1) {
        squad.data.infantry[weaponAdd.group].weapons[hasWeapon].qty += weaponAdd.qty;
      } else {
        squad.data.infantry[weaponAdd.group].weapons.push(_.cloneDeep(weaponAdd));
      }
    }
  }

  private hasWeapons(weapons, squad: Squad, platoon: Platoon): boolean {
    for (let weapon of weapons) {
      let hasWeapon = false;
      for (let squadWeapon of squad.data.infantry[weapon.group].weapons) {
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
