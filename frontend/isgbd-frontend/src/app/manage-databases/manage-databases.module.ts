import { SharedModule } from './../shared/shared.module';
import { manageDatabasesReducer } from './state';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageDatabasesRoute } from './manage-databases.route';
import { ManageDatabasesShellComponent } from './containers/manage-databases-shell/manage-databases-shell.component';
import { EffectsModule } from '@ngrx/effects';
import { ManageDatabasesEffects } from './state/manage-databases.effects';
import { StoreModule } from '@ngrx/store';
import { ManageDatabasesComponent } from './components/manage-databases/manage-databases.component';

@NgModule({
  declarations: [ManageDatabasesShellComponent, ManageDatabasesComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature('manageDatabases', manageDatabasesReducer),
    EffectsModule.forFeature(
      [ManageDatabasesEffects]
    ),
    RouterModule.forChild(ManageDatabasesRoute)
  ]
})
export class ManageDatabasesModule { }
