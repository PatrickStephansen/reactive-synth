import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConnectNodesEvent } from '../../connect-nodes-event';

@Component({
  selector: 'app-audio-node',
  templateUrl: './audio-node.component.html',
  styleUrls: ['./audio-node.component.scss']
})
export class AudioNodeComponent implements OnInit {
  @Input() nodeId: string;
  @Input() nodeType: string;
  @Input() numberInputs: number;
  @Input() numberOutputs: number;
  @Input() connectedSourceNodes: string[];
  @Input() availableSourceNodes: string[];

  @Output() connectSourceNode = new EventEmitter<ConnectNodesEvent>();

  constructor() {}

  ngOnInit() {}

  onConnectSourceNode(sourceId: string) {
    this.connectSourceNode.emit({
      sourceId: sourceId,
      destinationId: this.nodeId
    });
  }
}
