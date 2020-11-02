import { Action } from '@ngrx/store';

export enum ManageDatabasesActionTypes {
    GetDatabases = '[Manage Databases] Get Databases',
    GetDatabasesSuccess = '[Manage Database] GetDatabases Success',
    GetDatabasesFail = '[Manage Database] GetDatabases Fail',
    DeleteDatabase = '[Manage Database] Delete Database',
    DeleteDatabaseSuccess = '[Manage Database] Delete Database Success',
    DeleteDatabaseFail = '[Manage Database] Delete Database Fail',
    AddDatabase = '[Manage Database] Add Database',
    AddDatabaseSuccess = '[Manage Database] Add Database Success',
    AddDatabaseFail = '[Manage Database] Add Database Fail'
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

export class DeleteDatabase implements Action {
    readonly type = ManageDatabasesActionTypes.DeleteDatabase;

    constructor(public payload: string) {}
}

export class DeleteDatabaseSuccess implements Action {
    readonly type = ManageDatabasesActionTypes.DeleteDatabaseSuccess;

    constructor(public payload: string) {}
}

export class DeleteDatabaseFail implements Action {
    readonly type = ManageDatabasesActionTypes.DeleteDatabaseFail;

    constructor(public payload: string) {}
}

export class AddDatabase implements Action {
    readonly type = ManageDatabasesActionTypes.AddDatabase;

    constructor(public payload: string) {}
}

export class AddDatabaseSuccess implements Action {
    readonly type = ManageDatabasesActionTypes.AddDatabaseSuccess;

    constructor(public payload: string[]) {}
}

export class AddDatabaseFail implements Action {
    readonly type = ManageDatabasesActionTypes.AddDatabaseFail;

    constructor(public payload: string) {}
}

export type ManageDatabasesActions = GetDatabases 
    | GetDatabasesSuccess
    | GetDatabasesFail
    | DeleteDatabase
    | DeleteDatabaseSuccess
    | DeleteDatabaseFail
    | AddDatabase
    | AddDatabaseSuccess
    | AddDatabaseFail;
