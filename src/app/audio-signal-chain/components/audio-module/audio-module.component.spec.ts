import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioModuleComponent } from './audio-module.component';

describe('AudioModuleComponent', () => {
  let component: AudioModuleComponent;
  let fixture: ComponentFixture<AudioModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
