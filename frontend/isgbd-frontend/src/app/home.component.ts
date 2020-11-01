import { AppRoutes } from './core/constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromSelectedDatabase from './state/selected-database.selectors';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'viewer-home',
  template: ''
})
export class HomeComponent implements OnInit {
  selectedDatabase: string;

  constructor(private readonly store: Store, private readonly router: Router) {}

  ngOnInit() {
    if (this.selectedDatabase) {
        this.router.navigateByUrl(AppRoutes.ViewDatabase);
    } else {
        this.router.navigateByUrl(AppRoutes.ManageDatabases);  
    }
  
    this.store.pipe(select(fromSelectedDatabase.selectSelectedDatabase)).subscribe((selectedDatabase: string) => {
      this.selectedDatabase = selectedDatabase;
    });
  }
}
