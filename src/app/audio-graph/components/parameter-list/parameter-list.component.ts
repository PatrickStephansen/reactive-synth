import { Component, OnInit, Input } from '@angular/core';
import { Parameter } from '../../parameter';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  @Input() parameters: Parameter[];

  constructor() {}

  ngOnInit() {}
}
