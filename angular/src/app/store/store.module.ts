import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductThumbnailComponent } from './product-thumbnail/product-thumbnail.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { StoreComponent } from './store.component';



@NgModule({
  declarations: [ProductThumbnailComponent, ProductGridComponent, StoreComponent],
  exports: [
    StoreComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StoreModule { }
