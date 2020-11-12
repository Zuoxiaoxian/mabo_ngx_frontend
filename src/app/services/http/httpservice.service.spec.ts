

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-09 13:25:31
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-11-09 13:27:35
 */
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpserviceService } from './httpservice.service';

describe('Service: Httpservice', () => {
  let service: HttpserviceService;
  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   providers: [HttpserviceService]
    // });
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpserviceService);
  });

  it('should ...', inject([HttpserviceService], (service: HttpserviceService) => {
    expect(service).toBeTruthy();
  }));
});
