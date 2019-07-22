import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyUnitDetailsComponent } from './army-unit-details.component';

describe('ArmyUnitDetailsComponent', () => {
  let component: ArmyUnitDetailsComponent;
  let fixture: ComponentFixture<ArmyUnitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmyUnitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmyUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
