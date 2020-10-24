import { Action } from '@ngrx/store';

export enum ManageDatabasesActionTypes {
    GetDatabases = '[Manage Databases] Get Databases',
    GetDatabasesSuccess = '[Manage Database] GetDatabases Success',
    GetDatabasesFail = '[Manage Database] GetDatabases Fail'
}

export class GetDatabases implements Action {
    readonly type = ManageDatabasesActionTypes.GetDatabases;
}

export class GetDatabasesSuccess implements Action {
    readonly type = ManageDatabasesActionTypes.GetDatabasesSuccess;

    constructor(public payload: string[]) {}
}

export class GetDatabasesFail implements Action {
    readonly type = ManageDatabasesActionTypes.GetDatabasesFail;

    constructor(public payload: string) {}
}

export type ManageDatabasesActions = GetDatabases 
    | GetDatabasesSuccess
    | GetDatabasesFail;
