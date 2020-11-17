import { AttributeModel } from './../../../shared/models/attribute.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableModel } from 'src/app/shared/models';

interface DialogData {
  
}

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.scss']
})
export class AddTableComponent implements OnInit {
  createTableForm: FormGroup;
  columns = [];
  types = ['integer', 'varchar', 'char']

  @Output() createTableAction: EventEmitter<TableModel> = new EventEmitter<TableModel>();
  
  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<AddTableComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.createTableForm = this.fb.group({
      tableName: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*[a-zA-Z0-9]$')]],
      column: this.fb.group({
        name: ['', [Validators.required, this.columnNameValidator()]],
        type: ['', [Validators.required]],
        length: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
        primaryKey: [false],
        isNull: [false],
        isUnique: [false]
      })
    })
  }

  get columnControl() {
    return this.createTableForm.get('column') as FormGroup;
  }

  get disableCreateButton() {
    return !this.createTableForm.controls.tableName.valid || !this.columns.length;
  }

  get disableAddColumnButton() {
    return !this.columnControl.controls.name.valid || !this.columnControl.controls.type.valid || !this.columnControl.controls.length.valid;
  }

  addColumn() {
    this.columnControl.markAllAsTouched();
    this.columns.push(this.columnControl.value);
    this.columnControl.reset();
  }

  cancel() {
    this.dialogRef.close(true);
  }

  removeColumn(columnName: string) {
    this.columns = this.columns.filter((column: any) => column.name !== columnName);
  }

  createTable() {
    const tableName = this.createTableForm.controls.tableName.value;
    const attributes = this.columns.map((column: any) => {
      const attribute = {
        attributeName: column.name,
        type: column.type,
        length: column.lenght,
        isNull: column.isNull,
        isUnique: column.isUnique
      };

      return new AttributeModel(attribute); 
    });

    const primaryKey = this.columns
      .filter((column: any) => column.primaryKey)
      .map((column: any) => column.name);

    const table = new TableModel({
      tableName,
      fileName: null,
      rowLength: null,
      attributes,
      primaryKey,
      foreignKeys: [],
      indexFiles: []
    });
  }

  columnNameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const columnNameExists = this.columns.findIndex((column: any) => column.name === control.value);

      if (columnNameExists !== -1) {
        return {"nameExists": true};
      }

      return null;
    }
  }
}
