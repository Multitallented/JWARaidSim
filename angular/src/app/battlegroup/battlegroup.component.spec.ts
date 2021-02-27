import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlegroupComponent } from './battlegroup.component';

describe('BattlegroupComponent', () => {
  let component: BattlegroupComponent;
  let fixture: ComponentFixture<BattlegroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlegroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
