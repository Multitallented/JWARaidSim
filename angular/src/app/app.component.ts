import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHome = true;
  isStore = false;
  isAbout = false;
  isGame = false;

  setView(view) {
    this.isHome = view === 'home';
    this.isAbout = view === 'about';
    this.isGame = view === 'game';
    this.isStore = view === 'store';
  }
}
