import { TestBed } from '@angular/core/testing';

import { ImagesApi } from './images-api';

describe('ImagesApi', () => {
  let service: ImagesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
