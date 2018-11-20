import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, RequiredValidator } from '@angular/forms';
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

  nodeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.nodeForm = this.formBuilder.group({
      selectedSourceNode: ['', RequiredValidator]
    });
  }

  submitNodeChanges() {
    if (this.nodeForm.valid) {
      const formValue = this.nodeForm.value;

      this.connectSourceNode.emit({
        sourceId: formValue.selectedSourceNode,
        destinationId: this.nodeId
      });
    }
  }
}
