import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableModel } from 'src/app/shared/models';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  tablesForm: FormGroup;

  @Input() tablesList: TableModel[];
  @Output() findDatabaseAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterTablesList: EventEmitter<string> = new EventEmitter<string>();
  @Output() createTableAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() createIndexAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.tablesForm = this.fb.group({
      searchTable: ['']
    });

    this.searchTableControl.valueChanges.pipe(debounceTime(500))
    .subscribe((searchString: string) => {
      this.filterTablesList.emit(searchString);
    });
  }

  get searchTableControl() {
    return this.tablesForm.controls.searchTable;
  }

  findDatabase() {
    this.findDatabaseAction.emit();
  }

  createTable() {
    this.createTableAction.emit();
  }

  createIndex() {
    this.createIndexAction.emit();
  }
}
