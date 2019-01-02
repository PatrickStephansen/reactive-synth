import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationListComponent } from './visualization-list.component';

describe('VisualizationListComponent', () => {
  let component: VisualizationListComponent;
  let fixture: ComponentFixture<VisualizationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
