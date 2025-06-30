import { TestBed } from '@angular/core/testing';

import { DrawerFormService } from './drawer-form.service';

describe('DrawerFormService', () => {
  let service: DrawerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
