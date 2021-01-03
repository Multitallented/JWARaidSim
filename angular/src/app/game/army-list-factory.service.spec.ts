import { TestBed } from '@angular/core/testing';

import { ArmyListFactoryService } from './army-list-factory.service';

describe('ArmyListFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArmyListFactoryService = TestBed.get(ArmyListFactoryService);
    expect(service).toBeTruthy();
  });
});
