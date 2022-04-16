import {Component, OnInit} from '@angular/core';

import {BossesService} from './bosses.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  bossesService = new BossesService();
  bossImg:string;
  bossName:string;

  ngOnInit() {
    // let hash = window.location.hash;
    // if (!hash || hash.length < 1 || hash.indexOf('/') < 0 ||
    //     hash.split('/')[1].length < 1) {
    //   return;
    // }
    // let navVars = hash.split('/');
    this.bossImg = this.bossesService.bosses[0].img;
    this.bossName = this.bossesService.bosses[0].name;
  }
}
