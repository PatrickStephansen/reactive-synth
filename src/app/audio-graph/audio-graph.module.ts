import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AudioGraphShellComponent } from './containers/audio-graph-shell/audio-graph-shell.component';
import { AudioNodeComponent } from './components/audio-node/audio-node.component';
import { AudioNodeListComponent } from './components/audio-node-list/audio-node-list.component';
import { AudioGraphService } from './audio-graph.service';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParametersShellComponent } from './containers/parameters-shell/parameters-shell.component';
import { ParameterListComponent } from './components/parameter-list/parameter-list.component';
import { SharedModule } from '../shared/shared.module';
import { AudioGraphEffects } from './state/audio-graph.effects';
import { reducer } from './state/audio-graph.reducers';

@NgModule({
  declarations: [
    AudioGraphShellComponent,
    AudioNodeComponent,
    AudioNodeListComponent,
    ParameterComponent,
    ParametersShellComponent,
    ParameterListComponent
  ],
  imports: [
    StoreModule.forFeature('graph', reducer),
    EffectsModule.forFeature([AudioGraphEffects]),
    SharedModule
  ],
  exports: [AudioGraphShellComponent],
  providers: [AudioGraphService]
})
export class AudioGraphModule {}
