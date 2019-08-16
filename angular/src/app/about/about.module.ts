import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutStoryComponent } from './about-story/about-story.component';
import { AboutComponent } from './about.component';



@NgModule({
  declarations: [AboutStoryComponent, AboutComponent],
  exports: [
    AboutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AboutModule { }
