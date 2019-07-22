import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArmyGroupListComponent } from './army-group-list/army-group-list.component';
import { ArmyUnitDetailsComponent } from './army-unit-details/army-unit-details.component';
import { GameComponent } from "./game.component";


@NgModule({
  declarations: [ArmyGroupListComponent, ArmyUnitDetailsComponent, GameComponent],
  exports: [
    ArmyGroupListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
