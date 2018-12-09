import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleHelpComponent } from './toggle-help.component';

describe('ToggleHelpComponent', () => {
  let component: ToggleHelpComponent;
  let fixture: ComponentFixture<ToggleHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
