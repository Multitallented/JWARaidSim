import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { AccountComponent } from './account/account.component';
import { HomeModule } from "./home/home.module";
import { AboutModule } from "./about/about.module";
import { GameModule } from "./game/game.module";
import { StoreModule } from "./store/store.module";

@NgModule({
  declarations: [
    AppComponent,
    MainFooterComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    HomeModule,
    AboutModule,
    GameModule,
    StoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
