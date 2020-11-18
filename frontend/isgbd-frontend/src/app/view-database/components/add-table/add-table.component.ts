import { AttributeModel } from './../../../shared/models/attribute.model';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableModel } from 'src/app/shared/models';
import { ForeignKeyModel } from 'src/app/shared/models/foreignKey.model';

interface DialogData {
  tablesList: TableModel[],
  createTableCallback: any
}

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.scss']
})
export class AddTableComponent implements OnInit {
  createTableForm: FormGroup;
  columns = [];
  foreignKeys = [];
  types = ['integer', 'double', 'varchar', 'char'];

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
      }),
      foreignKey: this.fb.group({
        attributeName: ['', [Validators.required]],
        referencedTableName: ['', Validators.required],
        referencedAttributeName: ['', Validators.required]
      })
    })
  }

  get columnControl() {
    return this.createTableForm.get('column') as FormGroup;
  }

  get foreignKeyControl() {
    return this.createTableForm.get('foreignKey') as FormGroup;
  }

  get disableCreateButton() {
    return !this.createTableForm.controls.tableName.valid || !this.columns.length;
  }

  get disableAddColumnButton() {
    return !this.columnControl.controls.name.valid || !this.columnControl.controls.type.valid || !this.columnControl.controls.length.valid;
  }

  get disableAddForeignKeyButton() {
    return !this.foreignKeyControl.valid;
  }

  get listOfAttributes() {
    const tableName = this.foreignKeyControl.controls.referencedTableName.value;

    if (tableName) {
      return this.data.tablesList.find((table: TableModel) => table.tableName === tableName).attributes;
    }

    return [];
  }

  addColumn() {
    this.columnControl.markAllAsTouched();
    this.columns.push(this.columnControl.value);
    this.columnControl.reset();
  }

  addForeignKey() {
    const foreignKey = new ForeignKeyModel(this.foreignKeyControl.value);

    this.foreignKeyControl.markAllAsTouched();
    this.foreignKeys.push(foreignKey);
    this.foreignKeyControl.reset();
  }

  cancel() {
    this.dialogRef.close();
  }

  removeColumn(columnName: string) {
    this.columns = this.columns.filter((column: any) => column.name !== columnName);
  }

  removeForeignKey(deletedForeignKey: ForeignKeyModel) {
    this.foreignKeys = this.foreignKeys
      .filter(
        (foreignKey: ForeignKeyModel) => foreignKey.attributeName !== deletedForeignKey.attributeName && 
                                         foreignKey.referencedTableName !== deletedForeignKey.referencedTableName && 
                                         foreignKey.referencedAttributeName !== deletedForeignKey.referencedAttributeName
      );
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
      foreignKeys: this.foreignKeys,
      indexFiles: []
    });

    this.data.createTableCallback(table);
    this.dialogRef.close();
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
