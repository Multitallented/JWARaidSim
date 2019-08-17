import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutStoryComponent } from './about-story.component';

describe('AboutStoryComponent', () => {
  let component: AboutStoryComponent;
  let fixture: ComponentFixture<AboutStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});