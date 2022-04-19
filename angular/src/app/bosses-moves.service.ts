import {Injectable} from '@angular/core';

import {Move} from "./models/move";
import {HttpClient} from "@angular/common/http";
import {Effect} from "./models/effect";

@Injectable({
  providedIn: 'root'
})
export class BossesMovesService {

  constructor(private httpClient: HttpClient) {}

  public static bossMoves = new Map<string, Move>();

  private static assembleMove(importMove: any):Move {
    let move = new Move();
    if (importMove.key) move.key = importMove.key;
    if (importMove.target) move.target = importMove.target;
    if (importMove.name) move.name = importMove.name;
    if (importMove.img) move.img = '/assets/moves/' + importMove.img;
    if (importMove.dmg) move.dmg = importMove.dmg;
    if (importMove.pen) move.pen = importMove.pen;
    if (importMove.remove) {
      move.remove = importMove.remove;
    }
    if (importMove.threatened) {
      move.threatened = importMove.threatened;
      move.threatenedMove = this.assembleMove(importMove.threatenedMove);
    }
    if (importMove.buffs) {
      move.buffs = [];
      for (let buff of importMove.buffs) {
        move.buffs.push(this.assembleEffect(buff));
      }
    }
    if (importMove.debuffs) {
      move.debuffs = [];
      for (let buff of importMove.debuffs) {
        move.debuffs.push(this.assembleEffect(buff));
      }
    }
    return move;
  }

  private static assembleEffect(importEffect: any): Effect {
    let effect = new Effect();
    effect.type = importEffect.type;
    effect.amount = importEffect.amount;
    effect.turns = importEffect.turns;
    effect.attacks = importEffect.attacks;
    return effect;
  }

  public getBossMove(name: string):Promise<Move> {
    let move = BossesMovesService.bossMoves.get(name);
    if (!move) {
      return new Promise<Move>((resolve) => {this.httpClient.get('assets/move-data/' + name + '.json').subscribe(data => {
        move = BossesMovesService.assembleMove(data);
        BossesMovesService.bossMoves.set(move.key, move);
        resolve(move);
      })});
    } else {
      return new Promise<Move>((resolve) => resolve(move));
    }
  }
}
