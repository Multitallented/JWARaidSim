import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArmyGroupListComponent } from './army-group-list/army-group-list.component';
import { ArmyUnitDetailsComponent } from './army-unit-details/army-unit-details.component';



@NgModule({
  declarations: [ArmyGroupListComponent, ArmyUnitDetailsComponent],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
