import { Injectable } from '@angular/core';

import * as germanWeapons from '../units/german/weapons.json';
import * as germanGrenadiers from '../units/german/platoons/grenadier.json';
import * as germanVariants from '../units/german/platoons/variants.json';

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
}
