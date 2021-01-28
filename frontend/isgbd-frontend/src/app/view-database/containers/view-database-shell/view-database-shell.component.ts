import { SelectFromTableComponent } from './../../components/select-from-table/select-from-table.component';
import { InsertInTableComponent } from './../../components/insert-in-table/insert-in-table.component';
import { AddTableComponent } from './../../components/add-table/add-table.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IndexModel, TableModel } from 'src/app/shared/models';
import { State } from 'src/app/state';
import * as fromViewDatabase from '../../state';
import * as fromSelectedDatabase from '../../../state/selected-database.selectors';
import { CreateIndex, CreateTable, DeleteTableRecords, GetDatabaseTables, InsertTableRecord, SelectRecords } from '../../state/view-database.actions';
import { ClearSelectedDatabase } from 'src/app/state/selected-database.actions';
import { CreateIndexComponent } from '../../components/create-index/create-index.component';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { DeleteFromTableComponent } from '../../components/delete-from-table/delete-from-table.component';

@Component({
  selector: 'app-view-database-shell',
  templateUrl: './view-database-shell.component.html',
  styleUrls: ['./view-database-shell.component.scss']
})
export class ViewDatabaseShellComponent implements OnInit, OnDestroy {
  tablesList: TableModel[] = [];
  filteredTablesList: TableModel[] = [];
  selectedDatabase: string;
  getTablesListLoadInProgress: boolean;
  recordsList: {key: string, value: string}[];

  private subscriptions: Subscription[] = [];

  constructor(private readonly store: Store<State>, private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.pipe(select(fromSelectedDatabase.selectSelectedDatabase)).subscribe((selectedDatabase: string) => {
        this.selectedDatabase = selectedDatabase;

        if (selectedDatabase) {
          this.store.dispatch(new GetDatabaseTables(selectedDatabase));
        }
      }),
      this.store.pipe(select(fromViewDatabase.getTablesList)).subscribe((tablesList: TableModel[]) => {
        this.tablesList = tablesList;
        this.filteredTablesList = tablesList;
      }),
      this.store.pipe(select(fromViewDatabase.getTablesListLoadingStatus)).subscribe((getTablesListLoadInProgress: boolean) => {
        this.getTablesListLoadInProgress = getTablesListLoadInProgress;
      }),
      this.store.pipe(select(fromViewDatabase.getTableRecords)).subscribe((recordsList: {key: string, value: string}[]) => {
        this.recordsList = recordsList;
      }),
    ); 
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  filterTablesList(searchString: string) {
    this.filteredTablesList = this.filterTables(searchString);
  }

  filterTables(searchString: string) {
    if (!searchString) {
      return this.tablesList;
    }

    let parsedSearchTerms = searchString.split(' ');

    return this.tablesList.filter((table: TableModel) => {
      for (let i = 0; i < parsedSearchTerms.length; i++) {
        if (parsedSearchTerms[i]) {
          if (!table.tableName.toLowerCase().includes(parsedSearchTerms[i].toLowerCase())) {
            return false; 
          }
        }
      }

      return true;
    })
  }

  findDatabase() {
    this.store.dispatch(new ClearSelectedDatabase());
  }

  openAddTableDialog() {
    this.dialog.open(AddTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        tablesList: this.tablesList,
        createTableCallback: this.createTable 
      }
    })
  }

  createTable = (table: TableModel) => {
    this.store.dispatch(new CreateTable({ databaseName: this.selectedDatabase, table }));
  }

  openCreateIndexDialog() {
    this.dialog.open(CreateIndexComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        tablesList: this.tablesList,
        createIndexCallback: this.createIndex
      }
    })
  }

  createIndex = (index: IndexModel, tableName: string) => {
    this.store.dispatch(new CreateIndex({databaseName: this.selectedDatabase, tableName, index}));
  }

  openInsertInTableDialog() {
    this.dialog.open(InsertInTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        tablesList: this.tablesList,
        insertRecordCallback: this.insertRecord
      }
    })
  }

  insertRecord = (tableName: string, value: {key: string, value: string}) => {
    this.store.dispatch(new InsertTableRecord({
      databaseName: this.selectedDatabase,
      tableName,
      value
    }));
  }

  openDeleteFromTableDialog() {
    this.dialog.open(DeleteFromTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        tablesList: this.tablesList,
        deleteRecordCallback: this.deleteRecord
      }
    });
  }

  deleteRecord = (tableName: string, conditions: {attributeName: string, condition: string, value: string}) => {
    this.store.dispatch(new DeleteTableRecords({
      databaseName: this.selectedDatabase,
      tableName,
      conditions
    }));
  }

  openSelectFromTableDialog() {
    this.dialog.open(SelectFromTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        tablesList: this.tablesList,
        selectRecordsCallback: this.selectRecords
      }
    });
  }

  selectRecords = (data: any) => {
    this.store.dispatch(new SelectRecords({
      databaseName: this.selectedDatabase,
      ...data
    }))
  }
}
