import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GraphError } from '../../model/graph-error';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent implements OnInit {
  @Input() errors: GraphError[];

  @Output() dismissError = new EventEmitter<string>();
  @Output() dismissAllErrors = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  getErrorId(error) {
    return error.id;
  }
}
