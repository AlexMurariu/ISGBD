import { Component, Input, OnInit } from '@angular/core';
import { TableModel } from 'src/app/shared/models';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.scss']
})
export class ViewTablesComponent implements OnInit {
  @Input() tablesList: TableModel[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
