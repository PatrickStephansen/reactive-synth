import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioModuleListComponent } from './audio-module-list.component';

describe('AudioModuleListComponent', () => {
  let component: AudioModuleListComponent;
  let fixture: ComponentFixture<AudioModuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioModuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
