import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { StoryBoardComponent } from './story-board/story-board.component';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [SliderComponent, StoryBoardComponent, HomeComponent],
  exports: [
    SliderComponent,
    StoryBoardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
