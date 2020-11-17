import { State } from './../../state/index';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableModel } from 'src/app/shared/models';
import { DropTable } from '../../state/view-database.actions';


@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.scss']
})
export class ViewTablesComponent {
  @Input() tablesList: TableModel[];
  @Input() databaseName: string;

  constructor(private readonly store: Store<State>) { }

  dropTable(tableName) {
    const params = {
      databaseName: this.databaseName,
      tableName
    };

    this.store.dispatch(new DropTable(params))
  }
}
