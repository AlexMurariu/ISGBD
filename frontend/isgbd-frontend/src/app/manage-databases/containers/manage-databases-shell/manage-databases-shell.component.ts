import { GetDatabases } from './../../state/manage-databases.actions';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { Subscription } from 'rxjs';
import * as fromManageDatabases from '../../state';

@Component({
  selector: 'app-manage-databases-shell',
  templateUrl: './manage-databases-shell.component.html',
  styleUrls: ['./manage-databases-shell.component.css']
})
export class ManageDatabasesShellComponent implements OnInit {
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch(new GetDatabases());
    
    this.subscriptions.push(
      this.store.pipe(select(fromManageDatabases.getDatabaseList)).subscribe((databaseList: string[]) => {
        console.log(databaseList);
      })
    )
  }

}
