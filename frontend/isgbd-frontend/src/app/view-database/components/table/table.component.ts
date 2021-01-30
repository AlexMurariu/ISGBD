import { UIService } from './../../../core/services/ui.service';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { TableModel } from 'src/app/shared/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisplayTableComponent } from '../display-table/display-table.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  records: {key: string, value: string}[];
  activePopup: MatDialogRef<any>;

  @Input() table: TableModel;
  @Input() databaseName: string;
  @Input() recordsList: {key: string, value: string}[];
  @Output() dropTableAction: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    private readonly uiServie: UIService, 
    private readonly dialog: MatDialog
  ) { }

  ngOnInit() {
    this.records = this.recordsList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordsList) {
      this.records = this.recordsList;

      if (this.activePopup) {
        this.activePopup.componentInstance.data = {
          table: this.table,
          databaseName: this.databaseName,
          recordsList: this.records
        }
      }
    }
  }

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
    this.activePopup = this.dialog.open(DisplayTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      disableClose: true,
      data: {
        table: this.table,
        databaseName: this.databaseName,
        recordsList: this.records
      }
    });
  }
}
