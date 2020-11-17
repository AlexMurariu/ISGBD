import { AddTableComponent } from './../../components/add-table/add-table.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TableModel } from 'src/app/shared/models';
import { State } from 'src/app/state';
import * as fromViewDatabase from '../../state';
import * as fromSelectedDatabase from '../../../state/selected-database.selectors';
import { CreateTable, GetDatabaseTables } from '../../state/view-database.actions';
import { ClearSelectedDatabase } from 'src/app/state/selected-database.actions';
import { CreateIndexComponent } from '../../components/create-index/create-index.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  dialogRefCreateTable: MatDialogRef<AddTableComponent>;
  dialogRefCreateIndex: MatDialogRef<CreateIndexComponent>;

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
      })
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
    this.dialogRefCreateTable = this.dialog.open(AddTableComponent, {
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
    this.dialogRefCreateTable.close();
  }

  openCreateIndexDialog() {
    this.dialogRefCreateIndex = this.dialog.open(CreateIndexComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      data: {
        
      }
    })
  }
}
