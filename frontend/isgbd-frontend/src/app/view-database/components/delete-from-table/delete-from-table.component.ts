import { AttributeModel } from './../../../shared/models/attribute.model';
import { ConditionSigns } from './../../../shared/constants/signs';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableModel } from 'src/app/shared/models';

interface DialogData {
  tablesList: TableModel[];
  deleteRecordCallback: any;
}

@Component({
  selector: 'app-delete-from-table',
  templateUrl: './delete-from-table.component.html',
  styleUrls: ['./delete-from-table.component.scss']
})
export class DeleteFromTableComponent implements OnInit {
  deleteRecordForm: FormGroup;
  conditions = ['gt', 'gte', 'lt', 'lte', 'eq', 'neq'];
  attributesList: AttributeModel[];
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<DeleteFromTableComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.deleteRecordForm = this.fb.group({
      tableName: '',
      attributeName: '',
      condition: '',
      value: ''
    });

    this.deleteRecordForm.controls.attributeName.disable();
    this.deleteRecordForm.controls.condition.disable();
    this.deleteRecordForm.controls.value.disable();

    this.subscriptions.push(
      this.deleteRecordForm.controls.tableName.valueChanges.subscribe((value: string) =>  {
        if (value) {
          this.attributeControl.enable();
          this.attributeControl.reset();
          
          this.conditionControl.enable();
          this.conditionControl.reset();

          this.valueControl.enable();
          this.valueControl.reset();
          this.setListOfAttributes(value);
        } else {
          this.attributeControl.disable();
          this.conditionControl.disable();
          this.valueControl.disable();
          this.deleteRecordForm.reset();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  get tableNameControl() {
    return this.deleteRecordForm.get("tableName");
  }

  get attributeControl() {
    return this.deleteRecordForm.get("attributeName");
  }

  get conditionControl() {
    return this.deleteRecordForm.get("condition");
  }

  get valueControl() {
    return this.deleteRecordForm.get("value");
  }

  getConditionSign(sign: string) {
    return ConditionSigns[sign];
  }

  cancel() {
    this.dialogRef.close(true);
  }

  setListOfAttributes(tableName: string) {
    this.attributesList = this.data.tablesList.find((table: TableModel) => table.tableName === tableName).attributes;
  }

  deleteRecord() {
    const tableName = this.tableNameControl.value;
    const conditions = {
      attributeName: this.attributeControl.value, 
      condition: this.conditionControl.value,
      value: this.valueControl.value
    }

    this.data.deleteRecordCallback(tableName, conditions);
    this.dialogRef.close();
  }
}
