import { AttributeModel } from './../../shared/models/attribute.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndexModel, TableModel } from 'src/app/shared/models';

@Injectable({
    providedIn: 'root'
})
export class ViewDatabaseService {
    private baseUrl = 'http://localhost:3001';

    constructor(private readonly http: HttpClient) {}

    getDatabaseTables(databaseName: string): Observable<TableModel[]> {
        const url = `${this.baseUrl}/database/${databaseName}`;
        
        return this.http.get<TableModel[]>(url)
            .pipe(
                map((tablesList: TableModel[]) => {
                    return tablesList;
                })
            )
    }

    dropTable(databaseName:string, tableName: string): Observable<string> {
        const url = `${this.baseUrl}/database/${databaseName}/table/${tableName}`;

        return this.http.delete<string>(url)
            .pipe(
                map((deletedTableName: any) => {
                    return deletedTableName.tableName;
                })
            )
    }

    createTable(databaseName:string, table: TableModel): Observable<TableModel[]> {
        const url = `${this.baseUrl}/database/${databaseName}/table`;

        return this.http.post<TableModel[]>(url, table)
            .pipe(
                map((tableList: TableModel[]) => {
                    return tableList;
                })
            )
    }

    createIndex(databaseName: string, tableName: string, index: IndexModel): Observable<TableModel[]> {
        const url = `${this.baseUrl}/database/${databaseName}/table/${tableName}/index`;

        return this.http.post<TableModel[]>(url, index)
            .pipe(
                map((tableList: TableModel[]) => {
                    return tableList;
                })
            )
    }

    getTableRecords(databaseName: string, tableName: string): Observable<{key: string, value: string}[]> {
        const url = `${this.baseUrl}/database/${databaseName}/table/${tableName}/data`;

        return this.http.get<{key: string, value: string}[]>(url)
            .pipe(
                map((recordsList: {key: string, value: string}[]) => {
                    return recordsList;
                })
            )
    }

    insertTableRecord(databaseName: string, tableName: string, value: {key: string, value: string}): Observable<any> {
        const url = `${this.baseUrl}/database/${databaseName}/table/${tableName}/data`;

        return this.http.post<any>(url, value)
        .pipe(
            map((response: any) => {
                return [];
            })
        )
    }

    deleteTableRecord(databaseName: string, tableName: string, conditions: {attributeName: string, condition: string, value: string}): Observable<any> {
        const url = `${this.baseUrl}/database/${databaseName}/table/${tableName}/delete-data`;

        return this.http.post<any>(url, conditions)
        .pipe(
            map((response: any) => {
                return [];
            })
        )
    }
    
    selectTableRecords(data: any): Observable<{data: string[], attributesList: AttributeModel[]}> {
        const url = `${this.baseUrl}/database/${data.databaseName}/table/${data.tableName}/select-data`;
        const body = {
            attributes: data.attributes,
            conditions: data.conditions,
            distinct: data.distinct
        }

        return this.http.post<any>(url, body)
        .pipe(
            map((response: {data: string[], attributesList: AttributeModel[]}) => {
                return response;
            })
        )
    }

    generateTableRecords(databaseName: string, table: string): Observable<any> {
        const url = `${this.baseUrl}/database/${databaseName}/generate-records`;

        const body = {
            tableName: table
        }

        return this.http.post<any>(url, body)
        .pipe(
            map((response: any) => {
                return [];
            })
        )
    }
}