import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioNode } from '../../model/audio-node';
import { ConnectNodesEvent } from '../../model/connect-nodes-event';
import { CreateConstantSource } from '../../state/audio-graph.actions';

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
  @Output() disconnectNodes = new EventEmitter<ConnectNodesEvent>();
  @Output() createOscillator = new EventEmitter<void>();
  @Output() createGainNode = new EventEmitter<void>();
  @Output() createDistortionNode = new EventEmitter<void>();
  @Output() createConstantSource = new EventEmitter<void>();
  @Output() toggleGraphOutputEnabled = new EventEmitter<boolean>();
  @Output() deleteNode = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  filterSourceNodes({ id, sourceIds }: AudioNode) {
    const excludeIds = [id, ...sourceIds];
    return this.sourceNodes
      .filter(n => !excludeIds.includes(n.id) && n.numberOutputs)
      .map(n => n.id);
  }

  getNodeId(index: number, node: AudioNode) {
    return (node && node.id) || null;
  }
}
