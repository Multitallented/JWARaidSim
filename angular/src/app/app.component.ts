import {Component, OnInit} from '@angular/core';

import {BossesService} from './bosses.service';
import {BossesMovesService} from './bosses-moves.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  bossesService = new BossesService();

  ngOnInit() {
    // let hash = window.location.hash;
    // if (!hash || hash.length < 1 || hash.indexOf('/') < 0 ||
    //     hash.split('/')[1].length < 1) {
    //   return;
    // }
    // let navVars = hash.split('/');
  }
}
