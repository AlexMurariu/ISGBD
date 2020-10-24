import { manageDatabasesReducer } from './state';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManageDatabasesRoute } from './manage-databases.route';
import { ManageDatabasesShellComponent } from './containers/manage-databases-shell/manage-databases-shell.component';
import { EffectsModule } from '@ngrx/effects';
import { ManageDatabasesEffects } from './state/manage-databases.effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [ManageDatabasesShellComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('manageDatabases', manageDatabasesReducer),
    EffectsModule.forFeature(
      [ManageDatabasesEffects]
    ),
    RouterModule.forChild(ManageDatabasesRoute)
  ]
})
export class ManageDatabasesModule { }
