import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioNode } from '../../audio-node';
import { ConnectNodesEvent } from '../../connect-nodes-event';

@Component({
  selector: 'app-audio-node-list',
  templateUrl: './audio-node-list.component.html',
  styleUrls: ['./audio-node-list.component.scss']
})
export class AudioNodeListComponent implements OnInit {
  @Input() nodes: AudioNode[];
  @Input() sourceNodes: AudioNode[];

  @Output() connectNodes = new EventEmitter<ConnectNodesEvent>();

  constructor() {}

  ngOnInit() {}
}
