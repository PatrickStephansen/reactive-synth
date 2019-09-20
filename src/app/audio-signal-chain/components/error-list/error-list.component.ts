import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SignalChainError } from '../../model/signal-chain-error';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorListComponent implements OnInit {
  @Input() errors: SignalChainError[];

  @Output() dismissError = new EventEmitter<string>();
  @Output() dismissAllErrors = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  getErrorId(error) {
    return error.id;
  }
}
