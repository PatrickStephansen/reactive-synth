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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MaxValidatorDirective,
    MinValidatorDirective,
    HelpMessageComponent,
    ToggleHelpComponent,
    StripSpacesPipe,
    PageNotFoundComponent
  ],
  imports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('app', reducer),
    RouterModule
  ],
  exports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HelpMessageComponent,
    ToggleHelpComponent,
    MaxValidatorDirective,
    MinValidatorDirective,
    StripSpacesPipe,
    PageNotFoundComponent
  ]
})
export class SharedModule {}
