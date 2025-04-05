import { TestBed } from '@angular/core/testing';

import { UserMonitoringService } from './usermonitoritng.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsermonitoritngService', () => {
  let service: UserMonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UserMonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
