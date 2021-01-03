import {Component, Inject, OnInit, ViewContainerRef} from '@angular/core';
import _ from 'lodash';
import {Platoon} from "./models/platoon";
import {Squad} from "./models/squad";
import {Faction} from "./models/faction";
import {ArmyGroupListComponent} from "../army-group-list/army-group-list.component";
import {ArmyListFactoryService} from "./army-list-factory.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  providers: [Platoon, Squad, Faction, ArmyGroupListComponent]
})
export class GameComponent implements OnInit {
  private readonly armyListService: ArmyListFactoryService;

  constructor(@Inject(ArmyListFactoryService) armyListService: ArmyListFactoryService,
              @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    this.armyListService = armyListService;
    this.armyListService.setRootViewContainerRef(viewContainerRef);
  }

  lists: Array<ArmyGroupListComponent> = [];

  nation: string;
  platoonOptions: Array<Platoon> = [];
  activeSquad: Squad;
  activePlatoon: Platoon;
  frontSide: boolean = true;
  squadMap: any = {};
  faction: Faction;
  selectedFaction: Faction;
  factionList: Array<Faction> = [];
  armyList: Array<Platoon> = [];

  ngOnInit() {
    let hash = window.location.hash;
    if (!hash || hash.length < 1 || hash.indexOf('/') < 0) {
      return;
    }
    let navVars = hash.split('/');
    if (navVars.length < 3) {
      return;
    }
    this.nation = navVars[2];
    this.lists.push(this.armyListService.addDynamicComponent(this.nation));
  }

  reset() {
    this.lists = [];
    this.armyListService.reset();
  }

  isAllied(cNation: string): boolean {
    if (this.lists.length < 1) {
      return true;
    }
    for (let list of this.lists) {
      if (!list.faction || ((!list.faction.allies || list.faction.allies.indexOf(cNation) === -1) &&
          list.nation.toUpperCase() !== cNation.toUpperCase())) {
        return false;
      }
    }
    return true;
  }

  selectNation(nation:string) {
    this.nation = nation;
    this.faction = null;
    this.selectedFaction = null;
    this.platoonOptions = new Array<Platoon>();
    this.squadMap = {};
    this.activeSquad = null;
    this.activePlatoon = null;
    this.frontSide = true;
    this.armyList = [];
    this.faction = null;
    this.selectedFaction = null;
    this.lists.push(this.armyListService.addDynamicComponent(this.nation));
    if (this.factionList.length < 1) {
      window.location.hash = '#/game/' + nation;
    }
  }

  getMinOptions(platoon: Platoon): number {
    let options = platoon.data.options;
    for (let squad of platoon.squads) {
      if (squad.data.options && squad.included) {
        options -= squad.data.options;
      }
    }
    return options;
  }

  viewSquad(squad: Squad, platoon: Platoon) {
    this.activePlatoon = platoon;
    this.activeSquad = squad;
    this.selectedFaction = null;
  }

  loadPlatoon(platoonData: any) {
    platoonData = platoonData.default;
    let platoon = new Platoon(platoonData.name, platoonData.standard);
    platoon.data = platoonData;
    if (platoonData.max) {
      platoon.max = platoonData.max;
    }
    for (let key in platoonData.squadLinks) {
      if (!key || !platoonData.squadLinks.hasOwnProperty(key)) {
        continue;
      }
      let squadData = platoonData.squadLinks[key];
      let squad = _.cloneDeep(this.squadMap[key]);
      squad = _.merge(squadData, squad);

      for (let i = 0; i < squadData.max; i++) {
        let newSquad = _.cloneDeep(squad);
        platoon.squads.push(newSquad);
        if (i >= squadData.min) {
          newSquad.included = false;
        } else {
          newSquad.included = true;
          newSquad.required = true;
          this.addSquad(platoon, newSquad);
        }
      }
    }
    for (let key in platoonData.squads) {
      if (!key || !platoonData.squads.hasOwnProperty(key)) {
        continue;
      }
      let squadData = platoonData.squads[key];
      let min = 0;
      let squad = new Squad(key, squadData.min > min, squadData.points);
      squad.data = squadData;
      if (squadData.modifiers) {
        squad.modifiers = _.cloneDeep(squadData.modifiers);
      }
      if (squadData.max === 0) {
        squad.required = true;
      }
      this.squadMap[key] = squad;
      for (let i = 0; i < squadData.max; i++) {
        let newSquad = _.cloneDeep(squad);
        platoon.squads.push(newSquad);
        if (i >= squadData.min) {
          newSquad.included = false;
        } else {
          newSquad.included = true;
          newSquad.required = true;
          this.addSquad(platoon, newSquad);
        }
        min++;
      }
    }
    this.platoonOptions.push(platoon);
  }

  getPoints(): number {
    let totalPoints = 0;
    for (let armyList of this.lists) {
      totalPoints += armyList.getPoints();
    }
    return totalPoints;
  }

  getOptions(): number {
    let totalOptions = 0;
    let subFirstStandard = false;
    for (let platoon of this.armyList) {
      if (!subFirstStandard && platoon.standard) {
        totalOptions += platoon.data.options;
        subFirstStandard = true;
      }
      totalOptions += platoon.getOptions();
    }
    return totalOptions;
  }

  getCardIcon(type: string): string {
    switch (this.nation) {
      case 'french':
        return type === 'infantry' ?
          '../../assets/french/f-helmet.png' : '../../assets/french/f-tank.png';
      case 'american':
        return type === 'infantry' ?
          '../../assets/american/a-helmet.png' : '../../assets/american/a-tank.png';
      case 'japanese':
        return type === 'infantry' ?
          '../../assets/japan/helmet.png' : '../../assets/japan/tank.png';
      default:
      case 'german':
        return type === 'infantry' ?
          '../../assets/germans/helmet.png' : '../../assets/germans/pz4.png';
    }
  }

  dupePlatoon(platoon: Platoon) {
    this.armyList.push(_.cloneDeep(platoon));
  }

  removePlatoon(platoon: Platoon) {
    let index = this.armyList.indexOf(platoon);
    if (index !== -1) {
      this.armyList.splice(index, 1);
    }
  }

  addSquad(platoon, squad) {
    squad.included = true;
    if (squad.data.alsoAdd) {
      for (let squadName of squad.data.alsoAdd) {
        if (!squadName) {
          continue;
        }
        let newSquad = _.cloneDeep(this.squadMap[squadName]);
        newSquad.included = true;
        platoon.squads.push(newSquad);
      }
    }
  }

  removeSquad(platoon, squad) {
    squad.included = false;
    if (squad.data.alsoAdd) {
      for (let squadName of squad.data.alsoAdd) {
        if (!squadName) {
          continue;
        }
        let i = 0;
        let squadFound = false;
        for (let cSquad of platoon.squads) {
          if (cSquad.name === squadName) {
            squadFound = true;
            break;
          }
          i++;
        }
        if (squadFound) {
          platoon.squads.splice(i, 1);
        }
      }
    }
  }

  getFactionPoints(): number {
    let points = this.getPoints();
    if (this.faction == null) {
      return points;
    }
    return Math.round(points - (points / this.faction.pointModifier));
  }
}
