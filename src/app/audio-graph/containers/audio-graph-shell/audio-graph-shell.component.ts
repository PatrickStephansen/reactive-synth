import { Component, OnInit, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioGraphState } from '../../state/audio-graph.state';
import { AudioNode } from '../../model/audio-node';
import { Observable } from 'rxjs';
import {
  getNodesState,
  getGraphOutputActiveState
} from '../../state/audio-graph.selectors';
import {
  ResetGraph,
  CreateOscillator,
  ConnectNodes,
  ToggleGraphActive,
  DisconnectNodes,
  CreateGainNode,
  DestroyNode,
  CreateDelayNode,
  CreateDistortionNode,
  CreateConstantSource,
  CreateFilterNode,
  CreateRectifierNode
} from '../../state/audio-graph.actions';
import { ConnectNodesEvent } from '../../model/connect-nodes-event';

@Component({
  selector: 'app-audio-graph-shell',
  templateUrl: './audio-graph-shell.component.html',
  styleUrls: ['./audio-graph-shell.component.scss']
})
export class AudioGraphShellComponent implements OnInit {
  audioNodes$: Observable<AudioNode[]>;
  graphOutputEnabled$: Observable<boolean>;

  constructor(private store: Store<AudioGraphState>) {
    store.dispatch(new ResetGraph());
    this.audioNodes$ = store.pipe(select(getNodesState));
    this.graphOutputEnabled$ = store.pipe(select(getGraphOutputActiveState));
  }

  ngOnInit() {}

  addOscillator() {
    this.store.dispatch(new CreateOscillator());
  }

  addGainNode() {
    this.store.dispatch(new CreateGainNode());
  }

  addDelayNode() {
    this.store.dispatch(new CreateDelayNode());
  }

  addFilterNode() {
    this.store.dispatch(new CreateFilterNode());
  }

  addDistortionNode() {
    this.store.dispatch(new CreateDistortionNode());
  }

  addRectifierNode() {
    this.store.dispatch(new CreateRectifierNode());
  }

  addConstantSource() {
    this.store.dispatch(new CreateConstantSource());
  }

  connectNodes(event: ConnectNodesEvent) {
    this.store.dispatch(new ConnectNodes(event));
  }

  disconnectNodes(event: ConnectNodesEvent) {
    this.store.dispatch(new DisconnectNodes(event));
  }

  toggleGraphOutputEnabled(enabled: boolean) {
    this.store.dispatch(new ToggleGraphActive(enabled));
  }

  deleteNode(nodeId: string) {
    this.store.dispatch(new DestroyNode(nodeId));
  }
}
