import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersShellComponent } from './parameters-shell.component';

describe('ParametersShellComponent', () => {
  let component: ParametersShellComponent;
  let fixture: ComponentFixture<ParametersShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
