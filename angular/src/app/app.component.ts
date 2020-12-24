import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
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

  ngOnInit() {
    let hash = window.location.hash;
    if (!hash || hash.length < 1 || hash.indexOf('/') < 0 ||
        hash.split('/')[1].length < 1) {
      return;
    }
    let navVars = hash.split('/');
    this.setView(navVars[1]);
  }
}
