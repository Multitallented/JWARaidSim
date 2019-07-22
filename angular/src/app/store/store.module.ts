import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductThumbnailComponent } from './product-thumbnail/product-thumbnail.component';
import { ProductGridComponent } from './product-grid/product-grid.component';



@NgModule({
  declarations: [ProductThumbnailComponent, ProductGridComponent],
  imports: [
    CommonModule
  ]
})
export class StoreModule { }
