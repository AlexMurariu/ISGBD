import { UIService } from './../../../core/services/ui.service';
import { Component, Input, OnInit } from '@angular/core';
import { TableModel } from 'src/app/shared/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() table: TableModel;
  
  constructor(private readonly uiServie: UIService) { }

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
}
