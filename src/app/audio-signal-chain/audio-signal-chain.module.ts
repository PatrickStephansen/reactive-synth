import { NgModule } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AudioSignalChainShellComponent } from './containers/audio-signal-chain-shell/audio-signal-chain-shell.component';
import { AudioModuleComponent } from './components/audio-module/audio-module.component';
import { AudioModuleListComponent } from './components/audio-module-list/audio-module-list.component';
import { AudioGraphService } from './audio-graph.service';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParametersShellComponent } from './containers/parameters-shell/parameters-shell.component';
import { InputsShellComponent } from './containers/inputs-shell/inputs-shell.component';
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
import { InputListComponent } from './components/input-list/input-list.component';
import { InputComponent } from './components/input/input.component';
import { TriggerParameterExtensionComponent } from './components/trigger-parameter-extension/trigger-parameter-extension.component';
import { OscillatorFactory } from './audio-modules/oscillator-factory';
import { AUDIO_MODULE_FACTORY } from './audio-modules/audio-module-factory';
import { GainFactory } from './audio-modules/gain-factory';
import { BitCrusherFactory } from './audio-modules/bit-crusher-factory';
import { DelayFactory } from './audio-modules/delay-factory';
import { ConstantSourceFactory } from './audio-modules/constant-source-factory';
import { ClockDividerFactory } from './audio-modules/clock-divider-factory';
import { DistortionFactory } from './audio-modules/distortion-factory';
import { EnvelopeGeneratorFactory } from './audio-modules/envelope-generator-factory';
import { FilterFactory } from './audio-modules/filter-factory';
import { InverseGainFactory } from './audio-modules/inverse-gain-factory';
import { NoiseGeneratorFactory } from './audio-modules/noise-generator-factory';
import { RectifierFactory } from './audio-modules/rectifier-factory';
import { ViewSelectorShellComponent } from './containers/view-selector-shell/view-selector-shell.component';
import { ControlsShellComponent } from './containers/controls-shell/controls-shell.component';
import { ControlSurfaceFactory } from './audio-modules/control-surface-factory';
import { ControlSurfaceComponent } from './components/control-surface/control-surface.component';
import { EnvelopeVisualizationComponent } from './components/envelope-visualization/envelope-visualization.component';
import { MonoMidiInputFactory } from './audio-modules/mono-midi-input-factory';

@NgModule({
  declarations: [
    AudioSignalChainShellComponent,
    AudioModuleComponent,
    AudioModuleListComponent,
    ParameterComponent,
    ParametersShellComponent,
    InputsShellComponent,
    InputListComponent,
    InputComponent,
    ParameterListComponent,
    ChoiceParameterComponent,
    ErrorsShellComponent,
    ErrorListComponent,
    VisualizationListComponent,
    LineGraphVisualizationComponent,
    VisualizationsShellComponent,
    TriggerParameterExtensionComponent,
    ViewSelectorShellComponent,
    ControlsShellComponent,
    ControlSurfaceComponent,
    EnvelopeVisualizationComponent
  ],
  imports: [
    StoreModule.forFeature('signalChain', reducer),
    EffectsModule.forFeature([AudioSignalChainEffects]),
    SharedModule
  ],
  exports: [ViewSelectorShellComponent],
  providers: [
    AudioGraphService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: AUDIO_MODULE_FACTORY, useClass: BitCrusherFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: ClockDividerFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: ConstantSourceFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: DelayFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: DistortionFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: EnvelopeGeneratorFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: FilterFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: GainFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: InverseGainFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: NoiseGeneratorFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: OscillatorFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: RectifierFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: ControlSurfaceFactory, multi: true },
    { provide: AUDIO_MODULE_FACTORY, useClass: MonoMidiInputFactory, multi: true }
  ]
})
export class AudioSignalChainModule {}
