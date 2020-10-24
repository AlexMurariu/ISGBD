import { AppRoutes } from './core/constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'viewer-home',
  template: ''
})
export class HomeComponent implements OnInit {
  selectedDatabase: string;

  constructor(private router: Router) {}

  ngOnInit() {
    // if (this.selectedDatabase) {
        // this.router.navigateByUrl(AppRoutes.ViewDatabase);
    // } else {
        this.router.navigateByUrl(AppRoutes.SelectDatabase);  
    // }

    
    // this.store.pipe(select(fromSelectedDatabase.selectSelectedDatabase)).subscribe((selectedDatabase: string) => {
    //   this.selectedDatabase = selectedDatabase;
    // });
  }
}
