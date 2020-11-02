import { Action } from '@ngrx/store';
import { TableModel } from 'src/app/shared/models';

export const enum ViewDatabaseActionTypes {
    GetDatabaseTables = '[View Database] Get Database Tables',
    GetDatabaseTablesSuccess = '[View Database] Get Database Tables Success',
    GetDatabaseTablesFail = '[View Database] Get Database Tables Fail',
}

export class GetDatabaseTables implements Action {
    readonly type = ViewDatabaseActionTypes.GetDatabaseTables;

    constructor(public payload: string) {}
}

export class GetDatabaseTablesSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.GetDatabaseTablesSuccess;

    constructor(public payload: TableModel[]) {}
}

export class GetDatabaseTablesFail implements Action {
    readonly type = ViewDatabaseActionTypes.GetDatabaseTablesFail;

    constructor(public payload: string) {}
}

export type ViewDatabaseActions = GetDatabaseTables
    | GetDatabaseTablesSuccess
    | GetDatabaseTablesFail;