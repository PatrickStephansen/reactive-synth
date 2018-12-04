import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const appFeatureSelector = createFeatureSelector<AppState>('app');

export const showHelpSelector = createSelector(
  appFeatureSelector,
  app => app.showHelp
);
