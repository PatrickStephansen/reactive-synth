import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsShellComponent } from './errors-shell.component';

describe('ErrorsShellComponent', () => {
  let component: ErrorsShellComponent;
  let fixture: ComponentFixture<ErrorsShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
