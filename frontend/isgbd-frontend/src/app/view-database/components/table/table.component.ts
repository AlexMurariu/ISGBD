import { Component, Input, OnInit } from '@angular/core';
import { TableModel } from 'src/app/shared/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() table: TableModel;
  
  constructor() { }

  ngOnInit(): void {
  }

}
