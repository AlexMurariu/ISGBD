import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { filterItems } from 'src/app/shared/helpers/filter-items.helper';

@Component({
  selector: 'app-manage-databases',
  templateUrl: './manage-databases.component.html',
  styleUrls: ['./manage-databases.component.scss']
})
export class ManageDatabasesComponent implements OnInit, OnChanges {
  filterDatabasesForm: FormGroup;
  filteredDatabaseList: string[];

  @Input() databaseList: string[];
  @Input() databaseIsLoading: boolean;
  @Input() getDatabaseListError: string;
  @Output() selectDatabaseAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteDatabaseAction: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterDatabasesForm = this.fb.group({
      searchDatabase: ['']
    });

    this.searchDatabaseControl.valueChanges.pipe(debounceTime(500))
    .subscribe((searchString: string) => {
      this.filteredDatabaseList = this.filterDatabases(searchString);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.databaseList) {
      this.filteredDatabaseList = changes.databaseList.currentValue;
    }
  }

  get searchDatabaseControl() {
    return this.filterDatabasesForm.get('searchDatabase');
  }

  selectDatabase(databaseName: string) {
    this.selectDatabaseAction.emit(databaseName);
  }
  
  deleteDatabase(databaseName: string) {
    this.deleteDatabaseAction.emit(databaseName);
  }

  filterDatabases(searchString: string) {
    if (!searchString) {
      return this.databaseList;
    }

    let parsedSearchTerms = searchString.split(' ');

    return this.databaseList.filter((databaseName: string) => {
      for (let i = 0; i < parsedSearchTerms.length; i++) {
        if (parsedSearchTerms[i]) {
          if (!databaseName.toLowerCase().includes(parsedSearchTerms[i].toLowerCase())) {
            return false; 
          }
        }
      }

      return true;
    })
  }
}
