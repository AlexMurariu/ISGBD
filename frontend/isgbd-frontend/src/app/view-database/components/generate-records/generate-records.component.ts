import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { TableModel } from 'src/app/shared/models';

interface DialogData {
  tablesList: TableModel[];
  generateRecordsCallback: any;
}

@Component({
  selector: 'app-generate-records',
  templateUrl: './generate-records.component.html',
  styleUrls: ['./generate-records.component.scss']
})
export class GenerateRecordsComponent implements OnInit {
  generateRecordForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<GenerateRecordsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.generateRecordForm = this.fb.group({
      tableName: ['', [Validators.required]]
    });
  }

  get tableNameControl() {
    return this.generateRecordForm.get('tableName');
  }

  cancel() {
    this.dialogRef.close();
  }

  generate() {
    if (this.tableNameControl.value) {
      this.data.generateRecordsCallback(this.tableNameControl.value);
    }
  }
}
