import { AddDatabase, DeleteDatabase, GetDatabases } from './../../state/manage-databases.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { Subscription } from 'rxjs';
import * as fromManageDatabases from '../../state';
import { ClearSelectedDatabase, SelectDatabase } from 'src/app/state/selected-database.actions';

@Component({
  selector: 'app-manage-databases-shell',
  templateUrl: './manage-databases-shell.component.html',
  styleUrls: ['./manage-databases-shell.component.scss']
})
export class ManageDatabasesShellComponent implements OnInit, OnDestroy {
  databaseList: string[];
  databaseIsLoading: boolean;
  getDatabaseListError: string;
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch(new GetDatabases());
    this.store.dispatch(new ClearSelectedDatabase());
    
    this.subscriptions.push(
      this.store.pipe(select(fromManageDatabases.getDatabaseList)).subscribe((databaseList: string[]) => {
        this.databaseList = databaseList;
      }),
      this.store.pipe(select(fromManageDatabases.getDatabaseLoadingStatus)).subscribe((databaseIsLoading: boolean) => {
        this.databaseIsLoading = databaseIsLoading;
      }),
      this.store.pipe(select(fromManageDatabases.getDatabaseListError)).subscribe((getDatabaseListError: string) => {
        this.getDatabaseListError = getDatabaseListError;
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
  }

  selectDatabase(databaseName: string) {
    this.store.dispatch(new SelectDatabase(databaseName));
  }

  deleteDatabase(databaseName: string) {
    this.store.dispatch(new DeleteDatabase(databaseName));
  }

  addDatabase(databaseName: string) {
    this.store.dispatch(new AddDatabase(databaseName));
  }
}
