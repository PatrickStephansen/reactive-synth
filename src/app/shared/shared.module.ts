import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpMessageComponent } from './help-message/help-message.component';
import { ToggleHelpComponent } from './toggle-help/toggle-help.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../state/app.reducers';

@NgModule({
  declarations: [HelpMessageComponent, ToggleHelpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('app', reducer)
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HelpMessageComponent,
    ToggleHelpComponent
  ]
})
export class SharedModule {}
