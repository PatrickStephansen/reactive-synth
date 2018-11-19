import { TestBed } from '@angular/core/testing';

import { AudioGraphService } from './audio-graph.service';

describe('AudioGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioGraphService = TestBed.get(AudioGraphService);
    expect(service).toBeTruthy();
  });
});
