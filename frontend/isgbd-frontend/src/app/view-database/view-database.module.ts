import { SharedModule } from './../shared/shared.module';
import { viewDatabaseReducer } from './state/index';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDatabaseShellComponent } from './containers/view-database-shell/view-database-shell.component';
import { RouterModule } from '@angular/router';
import { ViewDatabaseRoute } from './view-database.route';
import { ViewDatabaseEffects } from './state/view-database.effects';
import { StoreModule } from '@ngrx/store';
import { ActionsComponent } from './components/actions/actions.component';
import { ViewTablesComponent } from './components/view-tables/view-tables.component';
import { TableComponent } from './components/table/table.component';
import { AddTableComponent } from './components/add-table/add-table.component';
import { DisplayTableComponent } from './components/display-table/display-table.component';
import { CreateIndexComponent } from './components/create-index/create-index.component';
import { RecordsTableComponent } from './components/records-table/records-table.component';
import { InsertInTableComponent } from './components/insert-in-table/insert-in-table.component';
import { DeleteFromTableComponent } from './components/delete-from-table/delete-from-table.component';



@NgModule({
  declarations: [
    ViewDatabaseShellComponent, 
    ActionsComponent, 
    ViewTablesComponent, 
    TableComponent, 
    AddTableComponent, 
    DisplayTableComponent, CreateIndexComponent, RecordsTableComponent, InsertInTableComponent, DeleteFromTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('viewDatabase', viewDatabaseReducer),
    EffectsModule.forFeature(
      [ViewDatabaseEffects]
    ),
    RouterModule.forChild(ViewDatabaseRoute)
  ],
  entryComponents: [
    AddTableComponent,
    DisplayTableComponent,
    CreateIndexComponent,
    InsertInTableComponent,
    DeleteFromTableComponent
  ]
})
export class ViewDatabaseModule { }
