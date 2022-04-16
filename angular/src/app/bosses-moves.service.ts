import {Injectable} from '@angular/core';

import * as bossAlertCoil from "./bosses/moves/alert-coil.json";
import {Move} from "./models/move";
import {Effect} from "./models/effect";

@Injectable({
  providedIn: 'root'
})
export class BossesMovesService {

  public bossMoves: Map<string, Move>;

  constructor() {
    this.loadMove(bossAlertCoil);
  }

  private loadMove(importMove: any) {
    let move = this.assembleMove(importMove);
    this.bossMoves.set(move.name, move);
  }

  private assembleMove(importMove: any):Move {
    let move = new Move();
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
      for (let buff of importMove.buffs) {
        move.debuffs.push(this.assembleEffect(buff));
      }
    }
    return move;
  }

  private assembleEffect(importEffect: any): Effect {
    let effect = new Effect();
    effect.type = importEffect.type;
    effect.amount = importEffect.amount;
    effect.turns = importEffect.turns;
    effect.attacks = importEffect.attacks;
    return effect;
  }
}
