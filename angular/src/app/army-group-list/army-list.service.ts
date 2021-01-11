import {Injectable} from '@angular/core';

import * as germanWeapons from '../units/german/weapons.json';
import * as germanFactions from '../units/german/factions.json';
import * as germanGrenadierCompany from '../units/german/platoons/grenadier-company-command.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';
import * as germanGrenadiersMG from '../units/german/platoons/grenadier-mg.json';
import * as germanVolksgrenadiers from '../units/german/platoons/volksgrenadier.json';
import * as germanPanzer3 from '../units/german/platoons/panzer3.json';
import * as germanPanzer4 from '../units/german/platoons/panzer4.json';
import * as germanPanther from '../units/german/platoons/panther.json';
import * as germanVariants from '../units/german/platoons/variants.json';
import * as germanMortar from '../units/german/platoons/mortar.json';
import * as germanHeavyCompanyCommand from '../units/german/platoons/heavy-company-command.json';
import * as germanHeavyMortar from '../units/german/platoons/heavy-mortar.json';
import * as germanMachineGun from '../units/german/platoons/machine-gun.json';
import * as germanPanzergrenadiers from '../units/german/platoons/panzergrenadiers.json';
import * as germanFallschirmjager from '../units/german/platoons/fallschirmjager.json';
import * as germanHitlerYouth from '../units/german/platoons/hitler-youth.json';
import * as germanVolksturm from '../units/german/platoons/volksturm.json';
import * as germanFlak36AntiAircraft from '../units/german/platoons/flak36-anti-air.json';
import * as germanFlak38AntiAircraft from '../units/german/platoons/flak38-anti-air.json';
import * as germanIG18Artillery from '../units/german/platoons/ig-18-artillery-battery.json';
import * as germanleFH18Artillery from '../units/german/platoons/leFH18-artillery.json';
import * as germanAntiTank from '../units/german/platoons/anti-tank.json';
import * as germanHeavyArmoredRecon from '../units/german/platoons/heavy-armored-recon.json';
import * as germanArmoredRecon from '../units/german/platoons/armored-recon.json';
import * as germanAssaultArmoredRecon from '../units/german/platoons/assault-armored-recon.json';
import * as germanStugAssaultGun from '../units/german/platoons/stug-assault-gun.json';
import * as germanNashornAssaultGun from '../units/german/platoons/nashorn-assault-gun.json';
import * as germanMarderAssaultGun from '../units/german/platoons/marder-iii.json';
import * as germanNebelwerfer from '../units/german/platoons/rocket-battery.json';
import * as germanSnipers from '../units/german/platoons/sniper-teams.json';

import * as frenchFactions from '../units/french/factions.json';
import * as frenchWeapons from '../units/french/weapons.json';
import * as frenchInfantry from '../units/french/platoons/infantry-platoon.json';

import * as japaneseWeapons from '../units/japan/weapons.json';
import * as japaneseFactions from '../units/japan/factions.json';
import * as japaneseRiflePlatoon from '../units/japan/platoons/rifle-platoon.json';
import * as japaneseChiNu from '../units/japan/platoons/chi-nu.json';
import * as japaneseHaGo from '../units/japan/platoons/ha-go.json';

import * as americanWeapons from '../units/american/weapons.json';
import * as americanFactions from '../units/american/factions.json';
import * as americanInfantry from '../units/american/platoons/infantry.json';

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
    } else if (nation === 'french') {
      // @ts-ignore
      return frenchWeapons.default;
    } else if (nation === 'japanese') {
      // @ts-ignore
      return japaneseWeapons.default;
    } else if (nation === 'american') {
      // @ts-ignore
      return americanWeapons.default;
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
    }
    return this.getGermanPlatoons();
  }

  private getFrenchPlatoons(): Array<any> {
    let platoonDataArray = [];
    platoonDataArray.push(frenchInfantry);
    return platoonDataArray;
  }

  private getAmericanPlatoons(): Array<any> {
    let platoonsDataArray = [];
    platoonsDataArray.push(americanInfantry);
    return platoonsDataArray;
  }

  private getGermanPlatoons(): Array<any> {
    let platoonDataArray = [];
    platoonDataArray.push(germanVariants);
    platoonDataArray.push(germanGrenadierCompany);
    platoonDataArray.push(germanGrenadiers);
    platoonDataArray.push(germanGrenadiersMG);
    platoonDataArray.push(germanPanzergrenadiers);
    platoonDataArray.push(germanFallschirmjager);
    platoonDataArray.push(germanVolksgrenadiers);
    platoonDataArray.push(germanPanzer3);
    platoonDataArray.push(germanPanzer4);
    platoonDataArray.push(germanPanther);
    platoonDataArray.push(germanFlak36AntiAircraft);
    platoonDataArray.push(germanFlak38AntiAircraft);
    platoonDataArray.push(germanAntiTank);
    platoonDataArray.push(germanIG18Artillery);
    platoonDataArray.push(germanleFH18Artillery);
    platoonDataArray.push(germanHeavyArmoredRecon);
    platoonDataArray.push(germanArmoredRecon);
    platoonDataArray.push(germanAssaultArmoredRecon);
    platoonDataArray.push(germanStugAssaultGun);
    platoonDataArray.push(germanNashornAssaultGun);
    platoonDataArray.push(germanMarderAssaultGun);
    platoonDataArray.push(germanHitlerYouth);
    platoonDataArray.push(germanVolksturm);
    platoonDataArray.push(germanHeavyCompanyCommand);
    platoonDataArray.push(germanMachineGun);
    platoonDataArray.push(germanMortar);
    platoonDataArray.push(germanHeavyMortar);
    platoonDataArray.push(germanNebelwerfer);
    platoonDataArray.push(germanSnipers);
    return platoonDataArray;
  }

  private getJapanesePlatoons(): Array<any> {
    let platoonsDataArray = [];
    platoonsDataArray.push(japaneseRiflePlatoon);
    platoonsDataArray.push(japaneseChiNu);
    platoonsDataArray.push(japaneseHaGo);
    return platoonsDataArray;
  }

  getFactions(nation: string): Array<Faction> {
    if (nation === 'german') {
      return this.getFactionList(germanFactions);
    } else if (nation === 'french') {
      return this.getFactionList(frenchFactions);
    } else if (nation === 'japanese') {
      return this.getFactionList(japaneseFactions);
    } else if (nation === 'american') {
      return this.getFactionList(americanFactions);
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
