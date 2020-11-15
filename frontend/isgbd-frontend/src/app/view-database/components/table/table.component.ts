import { UIService } from './../../../core/services/ui.service';
import { Component, Input, OnInit } from '@angular/core';
import { TableModel } from 'src/app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { DisplayTableComponent } from '../display-table/display-table.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() table: TableModel;
  
  constructor(private readonly uiServie: UIService, private readonly dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDeleteTablePopup() {
    this.uiServie.showConfirmationPopup({
      title: 'Drop table',
      message: 'Are you sure you want to drop this table?',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    })
  }

  openDisplayTablePopup() {
    this.dialog.open(DisplayTableComponent, {
      minWidth: "90%",
      maxHeight: '98vh',
      disableClose: true,
      data: {
        
      }
    });
  }
}
