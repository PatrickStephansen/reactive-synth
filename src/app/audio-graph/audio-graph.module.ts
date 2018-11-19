import { NgModule } from '@angular/core';
import { AudioGraphShellComponent } from './containers/audio-graph-shell/audio-graph-shell.component';
import { AudioNodeComponent } from './components/audio-node/audio-node.component';
import { AudioNodeListComponent } from './components/audio-node-list/audio-node-list.component';
import { AudioGraphService } from './audio-graph.service';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParametersShellComponent } from './containers/parameters-shell/parameters-shell.component';
import { ParameterListComponent } from './components/parameter-list/parameter-list.component';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    StoreModule.forFeature('graph', {}),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AudioGraphShellComponent],
  providers: [AudioGraphService]
})
export class AudioGraphModule {}
