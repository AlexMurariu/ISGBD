import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDatabaseShellComponent } from './containers/view-database-shell/view-database-shell.component';
import { RouterModule } from '@angular/router';
import { ViewDatabaseRoute } from './view-database.route';



@NgModule({
  declarations: [ViewDatabaseShellComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ViewDatabaseRoute)
  ]
})
export class ViewDatabaseModule { }
