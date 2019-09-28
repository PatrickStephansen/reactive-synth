import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ClickOutsideModule } from 'ng-click-outside';

import { HelpMessageComponent } from './help-message/help-message.component';
import { ToggleHelpComponent } from './toggle-help/toggle-help.component';
import { reducer } from '../state/app.reducers';
import { MaxValidatorDirective } from './validators/max-validator';
import { MinValidatorDirective } from './validators/min-validator';
import { StripSpacesPipe } from './pipes/strip-spaces.pipe';

@NgModule({
  declarations: [
    MaxValidatorDirective,
    MinValidatorDirective,
    HelpMessageComponent,
    ToggleHelpComponent,
    StripSpacesPipe
  ],
  imports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('app', reducer)
  ],
  exports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HelpMessageComponent,
    ToggleHelpComponent,
    MaxValidatorDirective,
    MinValidatorDirective,
    StripSpacesPipe
  ]
})
export class SharedModule {}
