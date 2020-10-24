import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDatabaseShellComponent } from './containers/select-database-shell/select-database-shell.component';
import { RouterModule } from '@angular/router';
import { SelectDatabaseRoute } from './select-database.route';



@NgModule({
  declarations: [SelectDatabaseShellComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SelectDatabaseRoute)
  ]
})
export class SelectDatabaseModule { }
