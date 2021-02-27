import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle-counter',
  templateUrl: './battle-counter.component.html',
  styleUrls: ['./battle-counter.component.css']
})
export class BattleCounterComponent implements OnInit {

  undrawnCounters:Array<any> = [];

  counters:Array<any> = [];

  constructor() {
    this.setupUndrawnCounters();
  }

  ngOnInit() {
  }

  drawCounter() {
    if (this.undrawnCounters.length > 0) {
      const randIndex = Math.floor(Math.random() * this.undrawnCounters.length);
      const drawnCounter = this.undrawnCounters.splice(randIndex, 1);
      this.counters.push(drawnCounter);
    }
  }

  putCounterBack() {
    if (this.counters.length > 0) {
      const lastCounter = this.counters.pop();
      this.undrawnCounters.push(lastCounter);
    }
  }

  private setupUndrawnCounters() {
    for (let i = 1; i < 10; i++) {
      this.undrawnCounters.push(1);
    }
    for (let i = 1; i < 22; i++) {
      this.undrawnCounters.push(2);
    }
    for (let i = 1; i < 27; i++) {
      this.undrawnCounters.push(3);
    }
    for (let i = 1; i < 21; i++) {
      this.undrawnCounters.push(4);
    }
    for (let i = 1; i < 6; i++) {
      this.undrawnCounters.push(5);
      this.undrawnCounters.push("Air Attack");
    }
    for (let i = 0; i < 2; i++) {
      this.undrawnCounters.push("Mine Strike");
      this.undrawnCounters.push("Confusion");
      this.undrawnCounters.push("Ammo Low");
      this.undrawnCounters.push("Breakdown");
      this.undrawnCounters.push("Beyond the Call of Duty");
    }
  }

  getTotal(): number {
    let total = 0;
    for (const counter of this.counters) {
      if (!isNaN(counter)) {
        total += parseInt(counter);
      }
    }
    return total;
  }
}
