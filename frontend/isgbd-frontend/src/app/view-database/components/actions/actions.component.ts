import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  tablesForm: FormGroup;


  @Output() findDatabaseAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterTablesList: EventEmitter<string> = new EventEmitter<string>();
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
}
