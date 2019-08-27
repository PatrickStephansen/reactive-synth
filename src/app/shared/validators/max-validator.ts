import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

function maxValidator(maxValue: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value <= maxValue ? null : { min: control.value };
  };
}

@Directive({
  selector: '[appMax]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true }]
})
export class MaxValidatorDirective implements Validator {
  @Input('appMax') maxValue: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.maxValue
      ? maxValidator(this.maxValue)(control)
      : null;
  }
}
