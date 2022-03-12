import { ChoiceParameter } from './choice-parameter';
import { Parameter } from './parameter';
import { AudioModule } from './audio-module';
import { AudioModuleInput } from './audio-module-input';
import { AudioModuleOutput } from './audio-module-output';
import { Visualization } from './visualization/visualization';

export class CreateModuleResult {
  constructor(
    public module: AudioModule,
    public inputs: AudioModuleInput[],
    public outputs: AudioModuleOutput[],
    public parameters: Parameter[],
    public choiceParameters: ChoiceParameter[],
    public visualizations: Visualization[] = []
  ) {}
}
