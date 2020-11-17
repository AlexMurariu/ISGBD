import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableModel } from 'src/app/shared/models';

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
}