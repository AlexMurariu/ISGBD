import { State } from './../../state/index';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableModel } from 'src/app/shared/models';
import { DropTable } from '../../state/view-database.actions';


@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.scss']
})
export class ViewTablesComponent implements OnInit {
  records: {key: string, value: string}[];

  @Input() tablesList: TableModel[];
  @Input() databaseName: string;
  @Input() recordsList: {key: string, value: string}[];

  constructor(private readonly store: Store<State>) { }

  ngOnInit() {
    this.records = this.recordsList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordsList) {
      this.records = this.recordsList;
    }
  }

  dropTable(tableName) {
    const params = {
      databaseName: this.databaseName,
      tableName
    };

    this.store.dispatch(new DropTable(params))
  }
}
