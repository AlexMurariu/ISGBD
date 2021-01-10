import { Subscription } from 'rxjs';
import { AttributeModel } from './../../../shared/models/attribute.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { TableModel } from 'src/app/shared/models';
import * as _ from 'lodash';

interface DialogData {
  tablesList: TableModel[];
  insertRecordCallback: any;
}

@Component({
  selector: 'app-insert-in-table',
  templateUrl: './insert-in-table.component.html',
  styleUrls: ['./insert-in-table.component.scss']
})
export class InsertInTableComponent implements OnInit {
  insertRecordForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<InsertInTableComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.generateForm();

    this.subscriptions.push(
      this.insertRecordForm.controls.tableName.valueChanges.subscribe((value: string) =>  {
        this.generateForm();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  get tableNameControl() {
    return this.insertRecordForm.get('tableName');
  }

  selectedTable() {
    const tableName = this.tableNameControl.value;

    if (tableName) {
      return this.data.tablesList.find((table: TableModel) => table.tableName === tableName);
    }

    return null;
  }

  generateForm() {
    let tableName = '';

    if (this.insertRecordForm) {
      tableName = this.tableNameControl.value;
    }

    this.insertRecordForm = this.fb.group({
      tableName: tableName
    });

    if (this.selectedTable()) { 
      this.selectedTable().attributes.forEach((attribute: AttributeModel) => {
        this.insertRecordForm.addControl(attribute.attributeName, new FormControl(''));
      })
    }
  }

  cancel() {
    this.dialogRef.close(true);
  }

  insert() {
    let key = '';
    let value = '';
    this.selectedTable().attributes.forEach((attribute: AttributeModel) => {
      if (this.selectedTable().primaryKey.find((key: string) => key === attribute.attributeName)) {
        key = this.insertRecordForm.get(attribute.attributeName).value;
      } else {
        value = value + this.insertRecordForm.get(attribute.attributeName).value + '#';
      }
    })

    value = value.substr(0, value.length - 1);

    this.data.insertRecordCallback(this.tableNameControl.value, {key, value: value});
    this.dialogRef.close();
  }
}
