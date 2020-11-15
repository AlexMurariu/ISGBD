import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TableModel } from 'src/app/shared/models';
import { State } from 'src/app/state';
import * as fromViewDatabase from '../../state';
import * as fromSelectedDatabase from '../../../state/selected-database.selectors';
import { GetDatabaseTables } from '../../state/view-database.actions';
import { ClearSelectedDatabase } from 'src/app/state/selected-database.actions';

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

  private subscriptions: Subscription[] = [];

  constructor(private readonly store: Store<State>) { }

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
        // if (tablesList) {
        //   for (let i = 0; i < tablesList.length; i++) {
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //     this.tablesList.push(tablesList[i]);
        //   }
        // }
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
}
