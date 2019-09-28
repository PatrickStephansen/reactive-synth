import { Routes } from '@angular/router';
import { AudioSignalChainShellComponent } from './audio-signal-chain/containers/audio-signal-chain-shell/audio-signal-chain-shell.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  { path: 'signal-chain-modules', component: AudioSignalChainShellComponent },
  { path: '', redirectTo: '/signal-chain-modules', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
