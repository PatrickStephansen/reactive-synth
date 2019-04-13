import { ChoiceParameter } from './choice-parameter';
import { Parameter } from './parameter';
import { AudioModule } from './audio-module';

export class CreateModuleResult {
  constructor(
    public module: AudioModule,
    public parameters: Parameter[],
    public choiceParameters: ChoiceParameter[]
  ) {}
}
