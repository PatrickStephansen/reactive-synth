import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AudioSignalChainShellComponent } from './containers/audio-signal-chain-shell/audio-signal-chain-shell.component';
import { AudioModuleComponent } from './components/audio-module/audio-module.component';
import { AudioModuleListComponent } from './components/audio-module-list/audio-module-list.component';
import { AudioGraphService } from './audio-graph.service';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParametersShellComponent } from './containers/parameters-shell/parameters-shell.component';
import { ParameterListComponent } from './components/parameter-list/parameter-list.component';
import { SharedModule } from '../shared/shared.module';
import { AudioSignalChainEffects } from './state/audio-signal-chain.effects';
import { reducer } from './state/audio-signal-chain.reducers';
import { ChoiceParameterComponent } from './components/choice-parameter/choice-parameter.component';
import { ErrorsShellComponent } from './containers/errors-shell/errors-shell.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { VisualizationListComponent } from './components/visualization-list/visualization-list.component';
import { LineGraphVisualizationComponent } from './components/line-graph-visualization/line-graph-visualization.component';
import { VisualizationsShellComponent } from './containers/visualizations-shell/visualizations-shell.component';

@NgModule({
  declarations: [
    AudioSignalChainShellComponent,
    AudioModuleComponent,
    AudioModuleListComponent,
    ParameterComponent,
    ParametersShellComponent,
    ParameterListComponent,
    ChoiceParameterComponent,
    ErrorsShellComponent,
    ErrorListComponent,
    VisualizationListComponent,
    LineGraphVisualizationComponent,
    VisualizationsShellComponent
  ],
  imports: [
    StoreModule.forFeature('signalChain', reducer),
    EffectsModule.forFeature([AudioSignalChainEffects]),
    SharedModule
  ],
  exports: [AudioSignalChainShellComponent],
  providers: [AudioGraphService]
})
export class AudioSignalChainModule {}
