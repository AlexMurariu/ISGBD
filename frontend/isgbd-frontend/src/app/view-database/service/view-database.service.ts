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
}