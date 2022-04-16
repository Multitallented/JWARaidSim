import {Injectable} from '@angular/core';

import {Boss} from './models/boss';

import * as hydraboa from "./bosses/hydraboa.json";
import {Resistances} from "./models/resistances";

@Injectable({
  providedIn: 'root'
})
export class BossesService {

  public bosses: Array<Boss> = [];

  constructor() {
    this.bosses.push(BossesService.assembleBoss(hydraboa['default']));
  }

  private static assembleBoss(importBoss: any):Boss {
    if (importBoss == null) {
      return;
    }
    let boss = new Boss();
    if (importBoss.name) boss.name = importBoss.name;
    if (importBoss.img) boss.img = '/assets/profiles/' + importBoss.img;
    boss.hp = importBoss.hp;
    boss.dmg = importBoss.dmg;
    boss.speed = importBoss.speed;
    boss.armor = importBoss.armor;
    boss.crit = importBoss.crit;
    boss.resistances = new Resistances();
    if (importBoss.resistances) {
      if (importBoss.resistances.crit) boss.resistances.crit = importBoss.resistances.crit;
      if (importBoss.resistances.dot) boss.resistances.dot = importBoss.resistances.dot;
      if (importBoss.resistances.dmg) boss.resistances.dmg = importBoss.resistances.dmg;
      if (importBoss.resistances.rend) boss.resistances.rend = importBoss.resistances.rend;
      if (importBoss.resistances.speed) boss.resistances.speed = importBoss.resistances.speed;
      if (importBoss.resistances.stun) boss.resistances.stun = importBoss.resistances.stun;
      if (importBoss.resistances.stun) boss.resistances.swap = importBoss.resistances.swap;
      if (importBoss.resistances.stun) boss.resistances.taunt = importBoss.resistances.taunt;
      if (importBoss.resistances.stun) boss.resistances.vuln = importBoss.resistances.vuln;
    }
    if (importBoss.counter) boss.counter = importBoss.counter;
    boss.moveset = [];
    if (importBoss.moveset) {
      for (let moveArray of importBoss.moveset) {
        let moves = [];
        for (let move of moveArray) {
          moves.push(move);
        }
        boss.moveset.push(moves);
      }
    }
    return boss;
  }

}
