import {Injectable} from '@angular/core';

import * as germanWeapons from "./data/german/weapons.json";
import * as germanFactions from "./data/german/factions.json";

import * as russianFactions from "./data/russian/factions.json";
import * as russianWeapons from "./data/russian/weapons.json";

import {Faction} from "../game/models/faction";

@Injectable({
  providedIn: 'root'
})
export class ArmyListService {

  constructor() {
  }

  getWeapons(nation: string) {
    if (nation === 'german') {
      // @ts-ignore
      return germanWeapons.default;
    } else if (nation === 'russian') {
      // @ts-ignore
      return russianWeapons.default;
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
    } else if (nation === 'american') {
      return this.getAmericanPlatoons();
    } else if (nation === 'russian') {
      return this.getRussianPlatoons();
    }
    return this.getGermanPlatoons();
  }

  private getRussianPlatoons(): Array<any> {
    let platoonDataArray = [];
    return platoonDataArray;
  }

  private getFrenchPlatoons(): Array<any> {
    let platoonDataArray = [];
    return platoonDataArray;
  }

  private getAmericanPlatoons(): Array<any> {
    let platoonsDataArray = [];
    return platoonsDataArray;
  }

  private getGermanPlatoons(): Array<any> {
    let platoonDataArray = [];
    return platoonDataArray;
  }

  private getJapanesePlatoons(): Array<any> {
    let platoonsDataArray = [];
    return platoonsDataArray;
  }

  getFactions(nation: string): Array<Faction> {
    if (nation === 'german') {
      return this.getFactionList(germanFactions);
    } else if (nation === 'russian') {
      return this.getFactionList(russianFactions);
    }
    return this.getFactionList(germanFactions);
  }

  private getFactionList(factionsData): Array<Faction> {
    let returnFactions = [];
    for (let factionData of factionsData.default.factions) {
      let faction = new Faction(factionData.name, factionData.standardPlatoons, factionData.img,
        factionData.lore);
      if (factionData.startDate) {
        faction.startDate = factionData.startDate;
      }
      if (factionData.endDate) {
        faction.endDate = factionData.endDate;
      }
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
