import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndexModel, TableModel } from 'src/app/shared/models';

interface DialogData {
  tablesList: TableModel[];
  createIndexCallback: any;
}

@Component({
  selector: 'app-create-index',
  templateUrl: './create-index.component.html',
  styleUrls: ['./create-index.component.scss']
})
export class CreateIndexComponent implements OnInit {
  createIndexForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<CreateIndexComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.createIndexForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*[a-zA-Z0-9]$')]],
      tableName: ['', [Validators.required]],
      attributeName: ['', [Validators.required]]
    })
  }

  get listOfAttributes() {
    const tableName = this.createIndexForm.controls.tableName.value;

    if (tableName) {
      return this.data.tablesList.find((table: TableModel) => table.tableName === tableName).attributes;
    }

    return [];
  }

  cancel() {
    this.dialogRef.close(true);
  }

  createIndex() {
    const index = new IndexModel({
      indexName: this.createIndexForm.controls.name.value,
      keyLength: null,
      isUnique: null,
      indexType: null,
      indexAttribute: this.createIndexForm.controls.attributeName.value
    });

    this.data.createIndexCallback(index, this.createIndexForm.controls.tableName.value);
    this.dialogRef.close();
  }
}
