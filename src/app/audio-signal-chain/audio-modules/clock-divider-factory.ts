import { Injectable, EventEmitter } from '@angular/core';
import { IAudioContext, IAudioParam, AudioWorkletNode } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';
import { observableFromMessagePort } from '../observable-from-message-port';
import { frameRateLimit } from '../frame-rate-limit';
import { ExtensionEvent } from '../model/extension-event';
import { map } from 'rxjs/operators';
import { TriggerExtension } from '../model/trigger-extension';

@Injectable()
export class ClockDividerFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.ClockDivider;
  CreateAudioModule(
    context: IAudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: IAudioParam) => number,
    parameterMin: (parameter: IAudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string
  ): CreateModuleResult {
    const moduleType = AudioModuleType.ClockDivider;
    id = createModuleId(moduleType, id);
    const clockDividerNode = new AudioWorkletNode(context, 'clock-divider', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1]
    });

    const clockTrigger = clockDividerNode.parameters.get('clockTrigger');
    const resetTrigger = clockDividerNode.parameters.get('resetTrigger');
    const attackAfterTicks = clockDividerNode.parameters.get('attackAfterTicks');
    const releaseAfterTocks = clockDividerNode.parameters.get('releaseAfterTocks');
    const ticksOnReset = clockDividerNode.parameters.get('ticksOnReset');
    const tocksOnReset = clockDividerNode.parameters.get('tocksOnReset');

    const outputGain = context.createGain();
    outputGain.gain.value = defaultGain;
    clockDividerNode.connect(outputGain);

    graph.set(id, {
      internalNodes: [clockDividerNode, outputGain],
      outputMap: new Map([['output', outputGain]]),
      parameterMap: new Map([
        ['clock trigger', clockTrigger],
        ['reset trigger', resetTrigger],
        ['attack after ticks', attackAfterTicks],
        ['release after tocks', releaseAfterTocks],
        ['ticks on reset', ticksOnReset],
        ['tocks on reset', tocksOnReset],
        ['output gain', outputGain.gain]
      ])
    });

    const clockTriggered = observableFromMessagePort(
      clockDividerNode.port,
      'clock-trigger-change'
    ).pipe(frameRateLimit);
    clockDividerNode.port.start();

    const manualClockTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    subscriptions.push(
      manualClockTriggerEventEmitter
        .pipe(map((event: ExtensionEvent) => ({ ...event, type: 'manual-clock-trigger' })))
        .subscribe((next: ExtensionEvent) => clockDividerNode.port.postMessage(next))
    );
    const resetTriggered = observableFromMessagePort(
      clockDividerNode.port,
      'reset-trigger-change'
    ).pipe(frameRateLimit);
    clockDividerNode.port.start();

    const manualResetTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    subscriptions.push(
      manualResetTriggerEventEmitter
        .pipe(map((event: ExtensionEvent) => ({ ...event, type: 'manual-reset-trigger' })))
        .subscribe((next: ExtensionEvent) => clockDividerNode.port.postMessage(next))
    );

    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Interprets the incoming Clock Trigger parameter as a clock signal and outputs clock pulses of equal or slower tempo.
          The signal is interpretted as being a tick when sample value is greater than 0 and
          as a tock when the sample value is 0 or less.
          The Attack After Ticks and Release After Ticks parameters control the ratio between incoming and output clock pulses.
          Higher values mean more incoming pulses per output pulse.
          The Reset Trigger sets the internal tick and tock counters to the state specified by Ticks On Reset and Tocks On Reset.
          It can be used to synchronize with other modules.
          If the Clock Trigger ticks on the same sample as the reset, the tick counts.
        `
      },
      [],
      [
        {
          moduleId: id,
          name: 'output'
        }
      ],
      [
        {
          moduleId: id,
          name: 'clock trigger',
          sources: [],
          stepSize: 0.01,
          maxValue: parameterMax(clockTrigger),
          minValue: parameterMin(clockTrigger),
          value: clockTrigger.defaultValue,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', clockTriggered]]),
              new Map([['manual-trigger', manualClockTriggerEventEmitter]])
            )
          ],
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'reset trigger',
          sources: [],
          stepSize: 0.01,
          maxValue: parameterMax(resetTrigger),
          minValue: parameterMin(resetTrigger),
          value: resetTrigger.defaultValue,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', resetTriggered]]),
              new Map([['manual-trigger', manualResetTriggerEventEmitter]])
            )
          ],
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'attack after ticks',
          sources: [],
          stepSize: 0.25,
          maxValue: parameterMax(attackAfterTicks),
          minValue: parameterMin(attackAfterTicks),
          value: attackAfterTicks.defaultValue,
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'release after tocks',
          sources: [],
          stepSize: 0.25,
          maxValue: parameterMax(releaseAfterTocks),
          minValue: parameterMin(releaseAfterTocks),
          value: releaseAfterTocks.defaultValue,
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'ticks on reset',
          sources: [],
          stepSize: 0.25,
          maxValue: parameterMax(ticksOnReset),
          minValue: parameterMin(ticksOnReset),
          value: ticksOnReset.defaultValue,
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'tocks on reset',
          sources: [],
          stepSize: 0.25,
          maxValue: parameterMax(tocksOnReset),
          minValue: parameterMin(tocksOnReset),
          value: tocksOnReset.defaultValue,
          canConnectSources: true
        },
        {
          moduleId: id,
          name: 'output gain',
          sources: [],
          stepSize: 0.01,
          maxValue: parameterMax(outputGain.gain),
          minValue: parameterMin(outputGain.gain),
          value: defaultGain,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
