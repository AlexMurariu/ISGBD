import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-manage-databases',
  templateUrl: './manage-databases.component.html',
  styleUrls: ['./manage-databases.component.scss']
})
export class ManageDatabasesComponent implements OnInit {
  @Input() databaseList: string[];
  @Input() databaseIsLoading: boolean;
  @Input() getDatabaseListError: string;
  @Output() selectDatabaseAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteDatabaseAction: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  selectDatabase(databaseName: string) {
    this.selectDatabaseAction.emit(databaseName);
  }
  
  deleteDatabase(databaseName: string) {
    this.deleteDatabaseAction.emit(databaseName);
  }
}
