import { Injectable } from '@angular/core';

import * as germanWeapons from '../units/german/weapons.json';
import * as germanFactions from '../units/german/factions.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';
import * as germanPanzer4 from '../units/german/platoons/panzer4.json';
import * as germanVariants from '../units/german/platoons/variants.json';
import * as frenchFactions from '../units/french/factions.json';

import * as frenchWeapons from '../units/french/weapons.json';
import * as frenchInfantry from '../units/french/platoons/infantry-platoon.json';
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
    }
    return germanWeapons;
  }

  getPlatoons(nation: string): Array<any> {
    if (nation === 'german') {
      return this.getGermanPlatoons();
    } else if (nation === 'french') {
      return this.getFrenchPlatoons();
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
    platoonDataArray.push(germanPanzer4);
    platoonDataArray.push(germanVariants);
    return platoonDataArray;
  }

  getFactions(nation: string): Array<Faction> {
    if (nation === 'german') {
      return this.getFactionList(germanFactions);
    } else if (nation === 'french') {
      return this.getFactionList(frenchFactions);
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
