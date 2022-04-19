import {Component, Input, OnInit} from '@angular/core';
import {BossesMovesService} from "../bosses-moves.service";
import {Move} from "../models/move";

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.sass']
})
export class MoveComponent implements OnInit {

  @Input("move")
  private name:string;

  @Input("isboss")
  private isboss:boolean;

  move:Move;

  constructor(private bossesMovesService:BossesMovesService) {
  }

  ngOnInit() {
    this.move = new Move();
    this.bossesMovesService.getBossMove(this.name).then(move => {
      this.move = move;
    });
  }

}
