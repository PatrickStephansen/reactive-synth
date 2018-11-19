import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioGraphShellComponent } from './audio-graph-shell.component';

describe('AudioGraphShellComponent', () => {
  let component: AudioGraphShellComponent;
  let fixture: ComponentFixture<AudioGraphShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioGraphShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioGraphShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
