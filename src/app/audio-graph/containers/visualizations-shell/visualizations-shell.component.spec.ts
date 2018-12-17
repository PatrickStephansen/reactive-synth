import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationsShellComponent } from './visualizations-shell.component';

describe('VisualizationsShellComponent', () => {
  let component: VisualizationsShellComponent;
  let fixture: ComponentFixture<VisualizationsShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationsShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
