import { UIService } from './../../../core/services/ui.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModel } from 'src/app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { DisplayTableComponent } from '../display-table/display-table.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() table: TableModel;
  @Output() dropTableAction: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    private readonly uiServie: UIService, 
    private readonly dialog: MatDialog
  ) { }

  openDeleteTablePopup() {
    this.uiServie.showConfirmationPopup({
      title: 'Drop table',
      message: 'Are you sure you want to drop this table?',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      confirmCallback: this.deleteTable
    })
  }

  deleteTable = () => {
    this.dropTableAction.emit(this.table.tableName);
  }

  openDisplayTablePopup() {
    this.dialog.open(DisplayTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      disableClose: true,
      data: {
        table: this.table
      }
    });
  }
}
