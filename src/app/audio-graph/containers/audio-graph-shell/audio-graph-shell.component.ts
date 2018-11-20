import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioGraphState } from '../../state/audio-graph.state';
import { AudioNode } from '../../audio-node';
import { Observable } from 'rxjs';
import { getNodesState } from '../../state/audio-graph.selectors';
import { ResetGraph } from '../../state/audio-graph.actions';

@Component({
  selector: 'app-audio-graph-shell',
  templateUrl: './audio-graph-shell.component.html',
  styleUrls: ['./audio-graph-shell.component.scss']
})
export class AudioGraphShellComponent implements OnInit {
  audioNodes$: Observable<AudioNode[]>;

  constructor(store: Store<AudioGraphState>) {
    store.dispatch(new ResetGraph());
    this.audioNodes$ = store.pipe(select(getNodesState));
  }

  ngOnInit() {}
}
