import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyGroupListComponent } from './army-group-list.component';

describe('ArmyGroupListComponent', () => {
  let component: ArmyGroupListComponent;
  let fixture: ComponentFixture<ArmyGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmyGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmyGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
