import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectNodesEvent } from '../../model/connect-nodes-event';

@Component({
  selector: 'app-audio-node',
  templateUrl: './audio-node.component.html',
  styleUrls: ['./audio-node.component.scss']
})
export class AudioNodeComponent implements OnInit, OnChanges {
  @Input() nodeId: string;
  @Input() nodeType: string;
  @Input() numberInputs: number;
  @Input() numberOutputs: number;
  @Input() canDelete: boolean;
  @Input() connectedSourceNodes: string[];
  @Input() availableSourceNodes: string[];

  @Output() connectSourceNode = new EventEmitter<ConnectNodesEvent>();
  @Output() disconnectSourceNode = new EventEmitter<ConnectNodesEvent>();
  @Output() deleteNode = new EventEmitter<string>();

  connectNodeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.connectNodeForm = this.formBuilder.group({
      selectedSourceNode: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedSourceNoLongerAvailable =
      changes.availableSourceNodes &&
      !changes.availableSourceNodes.isFirstChange() &&
      this.connectNodeForm.value.selectedSourceNode &&
      !this.availableSourceNodes.includes(
        this.connectNodeForm.value.selectedSourceNode
      );

    if (selectedSourceNoLongerAvailable) {
      this.connectNodeForm.patchValue({ selectedSourceNode: '' });
    }
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
