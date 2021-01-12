import { Component, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttributeModel } from 'src/app/shared/models';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.scss']
})
export class RecordsTableComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<{key: string, value: string}>();
  
  @Input() attributes: AttributeModel[];
  @Input() primaryKey: string[];
  @Input() recordsList: {key: string, value: string}[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() { }
  
  ngOnInit(): void {
    if (!this.recordsList) {
      this.recordsList = [];
    }
    
    this.dataSource.data = this.recordsList;
    this.generateDisplayColumns();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordsList) {
      if (!this.recordsList) {
        this.recordsList = [];
      }

      this.dataSource.data = this.recordsList;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayAttributeValue(attribute: string, element: {key: string, value: string}, index: number) {
    const isPrimaryKey = this.primaryKey.find((primaryKey: string) => primaryKey === attribute);

    return isPrimaryKey ? element.key : this.getAttributeValue(element.value, index);
  }

  getAttributeValue(valuesString: string, index: number) {
    const values = valuesString.split('#');

    return values[index];
  }

  generateDisplayColumns() {
    this.displayedColumns = this.attributes.map((attribute: AttributeModel) => attribute.attributeName);
  }

}
