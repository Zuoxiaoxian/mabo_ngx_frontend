/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VideoServiceService } from './video-service.service';

describe('Service: VideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoServiceService]
    });
  });

  it('should ...', inject([VideoServiceService], (service: VideoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
