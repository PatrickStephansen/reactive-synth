import { TestBed } from '@angular/core/testing';

import { AudioSignalChainService } from './audio-graph.service';

describe('AudioSignalChainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioSignalChainService = TestBed.get(AudioSignalChainService);
    expect(service).toBeTruthy();
  });
});
