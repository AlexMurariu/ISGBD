import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string,
  message: string,
  cancelButton: string,
  confirmButton: string,
  confirmCallback?: any,
  cancelCallback?: any
}

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  cancel() {
    if (typeof this.data.cancelCallback === 'function') {
      this.data.cancelCallback();
    }

    this.dialogRef.close();
  }

  confirm(): void {
    if (typeof this.data.confirmCallback === 'function') {
      this.data.confirmCallback();
    }
    
    this.dialogRef.close();
  }
}
