import { TestBed } from '@angular/core/testing';

import { DateInfoService } from './date-info.service';

describe('DateInfoService', () => {
  let service: DateInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
