import { Subscription } from 'rxjs';
import { State } from './../../state/index';
import { Store, select } from '@ngrx/store';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableModel } from 'src/app/shared/models';
import { GetTableRecords } from '../../state/view-database.actions';
import * as fromViewDatabase from '../../state';

interface DialogData {
  table: TableModel;
  databaseName: string;
  recordsList: {key: string, value: string}[];
}

@Component({
  selector: 'app-display-table',
  templateUrl: './display-table.component.html',
  styleUrls: ['./display-table.component.scss']
})
export class DisplayTableComponent implements OnInit {
  recordsList: {key: string, value: string}[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    public readonly dialogRef: MatDialogRef<DisplayTableComponent>, 
    @Inject(MAT_DIALOG_DATA) 
    public data: DialogData,
    private readonly store: Store<State>
  ) { }

  ngOnInit() {
    const payload = {
      databaseName: this.data.databaseName,
      tableName: this.data.table.tableName
    };
    this.store.dispatch(new GetTableRecords(payload));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  cancel() {
    this.dialogRef.close(true);
  }

  isPrimaryKey(attributeName: string) {
    const isPrimaryKey = this.data.table.primaryKey.findIndex((primaryKey: string) => primaryKey === attributeName);

    return isPrimaryKey !== -1;
  }
}
