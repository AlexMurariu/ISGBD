import { AddTableComponent } from './../add-table/add-table.component';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  tablesForm: FormGroup;


  @Output() findDatabaseAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterTablesList: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly fb: FormBuilder, private readonly dialog: MatDialog) { }

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

  openAddTableDialog() {
    this.dialog.open(AddTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      disableClose: true,
      data: {
        
      }
    })
  }
}
