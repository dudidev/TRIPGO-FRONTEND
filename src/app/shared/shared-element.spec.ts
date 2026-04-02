import { TestBed } from '@angular/core/testing';

import { SharedElement } from './shared-element';

describe('SharedElement', () => {
  let service: SharedElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedElement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
