import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  @Output() disconnectSourceNode = new EventEmitter<ConnectNodesEvent>();

  connectNodeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.connectNodeForm = this.formBuilder.group({
      selectedSourceNode: ['', Validators.required]
    });
  }

  submitNodeConnectionForm() {
    if (this.connectNodeForm.valid) {
      const formValue = this.connectNodeForm.value;

      this.connectSourceNode.emit({
        sourceId: formValue.selectedSourceNode,
        destinationId: this.nodeId
      });
    }
  }

  disconnectNode(sourceId) {
    this.disconnectSourceNode.emit({
      sourceId,
      destinationId: this.nodeId
    });
  }
}
