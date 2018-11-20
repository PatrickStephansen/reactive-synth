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
  @Input() graphOutputEnabled: boolean;

  @Output() connectNodes = new EventEmitter<ConnectNodesEvent>();
  @Output() createOscillator = new EventEmitter<void>();
  @Output() toggleGraphOutputEnabled = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  filterSourceNodes(nodeId: string) {
    return this.sourceNodes.filter(n => n.id !== nodeId && n.numberOutputs).map(n => n.id);
  }
}
