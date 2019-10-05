import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlSurface } from '../../model/control-surface';
import { ControlSurfaceValueChangeEvent } from '../../model/control-surface-value-change-event';
import { ControlSurfaceRangeChangeEvent } from '../../model/control-surface-range-change-event';

@Component({
  selector: 'app-control-surface',
  templateUrl: './control-surface.component.html',
  styleUrls: ['./control-surface.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSurfaceComponent implements OnInit {
  @Input() controlSurface: ControlSurface;
  @Output() updateCoords = new EventEmitter<ControlSurfaceValueChangeEvent>();
  @Output() updateRange = new EventEmitter<ControlSurfaceRangeChangeEvent>();

  @ViewChild('minX', { static: true })
  minX;
  @ViewChild('maxX', { static: true })
  maxX;
  @ViewChild('minY', { static: true })
  minY;
  @ViewChild('maxY', { static: true })
  maxY;

  isChanging = false;

  constructor() {}

  ngOnInit() {}

  xMinChanged(newMin) {
    if (newMin !== this.controlSurface.shownMinX && this.minX.valid) {
      this.updateRange.emit({
        moduleId: this.controlSurface.moduleId,
        shownMinX: newMin,
        shownMaxX: this.controlSurface.shownMaxX,
        shownMinY: this.controlSurface.shownMinY,
        shownMaxY: this.controlSurface.shownMaxY
      });
    }
  }
  xMaxChanged(newMax) {
    if (newMax !== this.controlSurface.shownMaxX && this.maxX.valid) {
      this.updateRange.emit({
        moduleId: this.controlSurface.moduleId,
        shownMinX: this.controlSurface.shownMinX,
        shownMaxX: newMax,
        shownMinY: this.controlSurface.shownMinY,
        shownMaxY: this.controlSurface.shownMaxY
      });
    }
  }
  yMinChanged(newMin) {
    if (newMin !== this.controlSurface.shownMinY && this.minY.valid) {
      this.updateRange.emit({
        moduleId: this.controlSurface.moduleId,
        shownMinX: this.controlSurface.shownMinX,
        shownMaxX: this.controlSurface.shownMaxX,
        shownMinY: newMin,
        shownMaxY: this.controlSurface.shownMaxY
      });
    }
  }
  yMaxChanged(newMax) {
    if (newMax !== this.controlSurface.shownMaxY && this.maxY.valid) {
      this.updateRange.emit({
        moduleId: this.controlSurface.moduleId,
        shownMinX: this.controlSurface.shownMinX,
        shownMaxX: this.controlSurface.shownMaxX,
        shownMinY: this.controlSurface.shownMinY,
        shownMaxY: newMax
      });
    }
  }
}
