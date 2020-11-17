import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableModel } from 'src/app/shared/models';

interface DialogData {
  table: TableModel
}

@Component({
  selector: 'app-display-table',
  templateUrl: './display-table.component.html',
  styleUrls: ['./display-table.component.scss']
})
export class DisplayTableComponent {

  constructor(public readonly dialogRef: MatDialogRef<DisplayTableComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  cancel() {
    this.dialogRef.close(true);
  }

  isPrimaryKey(attributeName: string) {

  }

  isForeignKey(attributeName: string) {

  }

}
