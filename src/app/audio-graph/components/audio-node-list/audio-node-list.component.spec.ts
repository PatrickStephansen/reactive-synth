import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioNodeListComponent } from './audio-node-list.component';

describe('AudioNodeListComponent', () => {
  let component: AudioNodeListComponent;
  let fixture: ComponentFixture<AudioNodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioNodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
