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

  // TODO: extract each axis/value to it's own component

  @ViewChild('minX', { static: true })
  minX;
  @ViewChild('maxX', { static: true })
  maxX;
  @ViewChild('minY', { static: true })
  minY;
  @ViewChild('maxY', { static: true })
  maxY;
  @ViewChild('surface', { static: true })
  surfaceElement;

  isChanging = false;

  get surfaceSize() {
    return this.surfaceElement.nativeElement.clientWidth;
  }

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

  grabPoint(event) {
    this.isChanging = true;
    this.surfaceElement.nativeElement.setPointerCapture(event.pointerId);
    this.updateCoords.emit(this.domCoordToParamCoord(this.controlSurface.moduleId, event));
    this.killEvent(event);
  }

  killEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  movePoint(event) {
    if (!this.isChanging) {
      return;
    }
    this.updateCoords.emit(this.domCoordToParamCoord(this.controlSurface.moduleId, event));
    this.killEvent(event);
  }

  releasePoint(event) {
    this.isChanging = false;
    this.surfaceElement.nativeElement.releasePointerCapture(event.pointerId);
    this.killEvent(event);
  }

  private domCoordToParamCoord(moduleId, { offsetX, offsetY }) {
    return {
      moduleId,
      x: this.clamp(
        this.controlSurface.shownMinX,
        this.controlSurface.shownMaxX,
        this.controlSurface.shownMinX +
          (offsetX * (this.controlSurface.shownMaxX - this.controlSurface.shownMinX)) /
            this.surfaceSize
      ),
      y: this.clamp(
        this.controlSurface.shownMinY,
        this.controlSurface.shownMaxY,
        this.controlSurface.shownMinY +
          ((this.surfaceSize - offsetY) *
            (this.controlSurface.shownMaxY - this.controlSurface.shownMinY)) /
            this.surfaceSize
      )
    };
  }

  private clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  }
}
