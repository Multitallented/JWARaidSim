import { Injectable } from '@angular/core';

import * as germanWeapons from '../units/german/weapons.json';
import * as germanFactions from '../units/german/factions.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';
import * as germanVariants from '../units/german/platoons/variants.json';
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
    } else if (nation === 'american') {
      // TODO
    }
    return germanWeapons;
  }

  getPlatoons(nation: string): Array<any> {
    if (nation === 'german') {
      return this.getGermanPlatoons();
    } else if (nation === 'american') {
      // TODO
    }
    return this.getGermanPlatoons();
  }

  private getGermanPlatoons(): Array<any> {
    let platoonDataArray = [];
    platoonDataArray.push(germanGrenadiers);
    platoonDataArray.push(germanVariants);
    return platoonDataArray;
  }

  getFactions(nation: string): Array<Faction> {
    if (nation === 'german') {
      return this.getFactionList(germanFactions);
    }
    return this.getFactionList(germanFactions);
  }

  private getFactionList(factionsData): Array<Faction> {
    let returnFactions = [];
    for (let factionData of factionsData.default.factions) {
      let faction = new Faction(factionData.name, factionData.standardPlatoons);
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
      returnFactions.push(faction);
    }
    return returnFactions;
  }
}
