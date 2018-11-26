import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceParameterComponent } from './choice-parameter.component';

describe('ChoiceParameterComponent', () => {
  let component: ChoiceParameterComponent;
  let fixture: ComponentFixture<ChoiceParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
