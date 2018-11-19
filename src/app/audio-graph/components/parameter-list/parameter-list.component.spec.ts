import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterListComponent } from './parameter-list.component';

describe('ParameterListComponent', () => {
  let component: ParameterListComponent;
  let fixture: ComponentFixture<ParameterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
