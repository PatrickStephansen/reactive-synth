import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioNodeComponent } from './audio-node.component';

describe('AudioNodeComponent', () => {
  let component: AudioNodeComponent;
  let fixture: ComponentFixture<AudioNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
