import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  
}

@Component({
  selector: 'app-create-index',
  templateUrl: './create-index.component.html',
  styleUrls: ['./create-index.component.scss']
})
export class CreateIndexComponent implements OnInit {

  constructor(public readonly dialogRef: MatDialogRef<CreateIndexComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(true);
  }
}
