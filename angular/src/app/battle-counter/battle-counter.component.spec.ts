import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleCounterComponent } from './battle-counter.component';

describe('BattleCounterComponent', () => {
  let component: BattleCounterComponent;
  let fixture: ComponentFixture<BattleCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
