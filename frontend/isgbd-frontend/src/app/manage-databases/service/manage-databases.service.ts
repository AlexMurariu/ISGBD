import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ManageDatabaseService {
    private baseUrl = 'http://localhost:3001';

    constructor(private readonly http: HttpClient) {}

    getDatabases(): Observable<string[]> {
        const url = `${this.baseUrl}/databases`;
        
        return this.http.get<string[]>(url)
            .pipe(
                map((databaseList: string[]) => {
                    return databaseList;
                })
            )
    }
}