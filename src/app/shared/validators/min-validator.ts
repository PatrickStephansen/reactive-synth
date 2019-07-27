import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

function minValidator(minValue: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value >= minValue ? null : { min: control.value };
  };
}

@Directive({
  selector: '[min]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator {
  @Input('min') minValue: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.minValue
      ? minValidator(this.minValue)(control)
      : null;
  }
}
