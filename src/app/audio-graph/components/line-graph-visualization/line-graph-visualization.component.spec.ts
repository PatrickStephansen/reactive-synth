import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphVisualizationComponent } from './line-graph-visualization.component';

describe('LineGraphVisualizationComponent', () => {
  let component: LineGraphVisualizationComponent;
  let fixture: ComponentFixture<LineGraphVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineGraphVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
