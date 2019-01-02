import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSignalChainShellComponent } from './audio-signal-chain-shell.component';

describe('AudioSignalChainShellComponent', () => {
  let component: AudioSignalChainShellComponent;
  let fixture: ComponentFixture<AudioSignalChainShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioSignalChainShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSignalChainShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
