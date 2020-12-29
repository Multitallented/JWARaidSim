import { Injectable } from '@angular/core';

import * as germanWeapons from '../units/german/weapons.json';
import * as germanFactions from '../units/german/factions.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';
import * as germanVolksgrenadiers from '../units/german/platoons/volksgrenadier.json';
import * as germanPanzer4 from '../units/german/platoons/panzer4.json';
import * as germanVariants from '../units/german/platoons/variants.json';

import * as frenchFactions from '../units/french/factions.json';
import * as frenchWeapons from '../units/french/weapons.json';
import * as frenchInfantry from '../units/french/platoons/infantry-platoon.json';

import * as japaneseWeapons from '../units/japan/weapons.json';
import * as japaneseFactions from '../units/japan/factions.json';
import * as japaneseRiflePlatoon from '../units/japan/platoons/rifle-platoon.json';
import {Faction} from "./models/faction";

@Injectable({
  providedIn: 'root'
})
export class ArmyListService {

  constructor() { }

  getWeapons(nation: string) {
    if (nation === 'german') {
      // @ts-ignore
      return germanWeapons.default;
    } else if (nation === 'french') {
      // @ts-ignore
      return frenchWeapons.default;
    } else if (nation === 'japanese') {
      // @ts-ignore
      return japaneseWeapons.default;
    }
    return germanWeapons;
  }

  getPlatoons(nation: string): Array<any> {
    if (nation === 'german') {
      return this.getGermanPlatoons();
    } else if (nation === 'french') {
      return this.getFrenchPlatoons();
    } else if (nation === 'japanese') {
      return this.getJapanesePlatoons();
    }
    return this.getGermanPlatoons();
  }

  private getFrenchPlatoons(): Array<any> {
    let platoonDataArray = [];
    platoonDataArray.push(frenchInfantry);
    return platoonDataArray;
  }

  private getGermanPlatoons(): Array<any> {
    let platoonDataArray = [];
    platoonDataArray.push(germanGrenadiers);
    platoonDataArray.push(germanVolksgrenadiers);
    platoonDataArray.push(germanPanzer4);
    platoonDataArray.push(germanVariants);
    return platoonDataArray;
  }

  private getJapanesePlatoons(): Array<any> {
    let platoonsDataArray = [];
    platoonsDataArray.push(japaneseRiflePlatoon);
    return platoonsDataArray;
  }

  getFactions(nation: string): Array<Faction> {
    if (nation === 'german') {
      return this.getFactionList(germanFactions);
    } else if (nation === 'french') {
      return this.getFactionList(frenchFactions);
    } else if (nation === 'japanese') {
      return this.getFactionList(japaneseFactions);
    }
    return this.getFactionList(germanFactions);
  }

  private getFactionList(factionsData): Array<Faction> {
    let returnFactions = [];
    for (let factionData of factionsData.default.factions) {
      let faction = new Faction(factionData.name, factionData.standardPlatoons, factionData.img,
          factionData.lore);
      if (factionData.specials) {
        faction.specials = factionData.specials;
      }
      if (factionData.modifiers) {
        faction.modifiers =factionData.modifiers;
      }
      if (factionData.abilities) {
        faction.abilities = factionData.abilities;
      }
      if (factionData.pointModifier) {
        faction.pointModifier = factionData.pointModifier;
      }
      if (factionData.nations) {
        faction.nations = factionData.nations;
      }
      if (factionData.allies) {
        faction.allies = factionData.allies;
      }
      returnFactions.push(faction);
    }
    return returnFactions;
  }
}
