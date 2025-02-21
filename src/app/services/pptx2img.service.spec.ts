import { TestBed } from '@angular/core/testing';

import { Pptx2imgService } from './pptx2img.service';

describe('Pptx2imgService', () => {
  let service: Pptx2imgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pptx2imgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
