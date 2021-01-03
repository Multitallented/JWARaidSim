import { TestBed } from '@angular/core/testing';

import { ArmyListService } from './army-list.service';

describe('ArmyListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArmyListService = TestBed.get(ArmyListService);
    expect(service).toBeTruthy();
  });
});
