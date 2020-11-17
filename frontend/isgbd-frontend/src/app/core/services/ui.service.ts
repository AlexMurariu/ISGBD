import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../components/confirmation-popup/confirmation-popup.component';

@Injectable({
  providedIn: 'root'
})
export class UIService {
    dialogRef: MatDialogRef<ConfirmationPopupComponent>;
    tabIndex: string;

    constructor(public readonly dialog: MatDialog) { }

    showConfirmationPopup(params: {
      title: string, 
      message: string, 
      confirmButtonText: string, 
      cancelButtonText?: string, 
      confirmCallback?: any, 
      closeCallback?: any,
      cancelCallback?: any,
      automatedClosing?: boolean,
    }) {
        const { title, message, confirmButtonText, cancelButtonText, confirmCallback, cancelCallback, closeCallback } = params;

        this.dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            disableClose: true,
            data: {
              title, 
              message, 
              confirmButton: confirmButtonText, 
              cancelButton: cancelButtonText, 
              confirmCallback, 
              cancelCallback,
            }
          });

        this.dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            confirmCallback ? confirmCallback() : ''
          } else if (result === false) {
            closeCallback ? closeCallback() : ''
          }
        });
    }

    closeConfirmationPopup() {
      if (this.dialogRef && this.dialogRef.close) {
        this.dialogRef.close(null);
      }
    }
}
