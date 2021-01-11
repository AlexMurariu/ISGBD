import { Action } from '@ngrx/store';
import { IndexModel, TableModel } from 'src/app/shared/models';

export const enum ViewDatabaseActionTypes {
    GetDatabaseTables = '[View Database] Get Database Tables',
    GetDatabaseTablesSuccess = '[View Database] Get Database Tables Success',
    GetDatabaseTablesFail = '[View Database] Get Database Tables Fail',
    CreateTable = '[View Database] Create Table',
    CreateTableSuccess = '[View Database] Create Table Success',
    CreateTableFail = '[View Database] Create Table Fail',
    DropTable = '[View Database] Drop Table',
    DropTableSuccess = '[View Database] Drop Table Success',
    DropTableFail = '[View Database] Drop Table Fail',
    CreateIndex = '[View Database] Create Index',
    CreateIndexSuccess = '[View Database] Create Index Success',
    CreateIndexFail = '[View Database] Create Index Fail',
    GetTableRecords = '[View Database] Get Table Records',
    GetTableRecordsSuccess = '[View Database] Get Table Records Success',
    GetTableRecordsFail = '[View Database] Get Table Records Fail',
    InsertTableRecord = '[View Database] Insert Table Record',
    InsertTableRecordSuccess = '[View Database] Insert Table Record Success',
    InsertTableRecordFail = '[View Database] Insert Table Record Fail',
    DeleteTableRecords = '[View Database] Delete Table Records',
    DeleteTableRecordsSuccess = '[View Database] Delete Table Records Success',
    DeleteTableRecordsFail = '[View Database] Delete Table Records Fail'
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

export class CreateTable implements Action {
    readonly type = ViewDatabaseActionTypes.CreateTable;

    constructor(public payload: {databaseName: string, table: TableModel}) {}
}

export class CreateTableSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.CreateTableSuccess;

    constructor(public payload: TableModel[]) {}
}

export class CreateTableFail implements Action {
    readonly type = ViewDatabaseActionTypes.CreateTableFail;

    constructor(public payload: string) {}
}

export class DropTable implements Action {
    readonly type = ViewDatabaseActionTypes.DropTable;

    constructor(public payload: {databaseName: string, tableName: string}) {}
}

export class DropTableSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.DropTableSuccess;

    constructor(public payload: string) {}
}

export class DropTableFail implements Action {
    readonly type = ViewDatabaseActionTypes.DropTableFail;

    constructor(public payload: string) {}
}

export class CreateIndex implements Action {
    readonly type = ViewDatabaseActionTypes.CreateIndex;

    constructor(public payload: {databaseName: string, tableName: string, index: IndexModel}) {}
}

export class CreateIndexSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.CreateIndexSuccess;

    constructor(public payload: TableModel[]) {}
}

export class CreateIndexFail implements Action {
    readonly type = ViewDatabaseActionTypes.CreateIndexFail;

    constructor(public payload: string) {}
}

export class GetTableRecords implements Action {
    readonly type = ViewDatabaseActionTypes.GetTableRecords;

    constructor(public payload: {databaseName: string, tableName: string}) {}
}

export class GetTableRecordsSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.GetTableRecordsSuccess;

    constructor(public payload: {key: string, value: string}[]) {}
}

export class GetTableRecordsFail implements Action {
    readonly type = ViewDatabaseActionTypes.GetTableRecordsFail;

    constructor(public payload: string) {}
}

export class InsertTableRecord implements Action {
    readonly type = ViewDatabaseActionTypes.InsertTableRecord;

    constructor(public payload: {databaseName: string, tableName: string, value: {key: string, value: string}}) {}
}

export class InsertTableRecordSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.InsertTableRecordSuccess;
}

export class InsertTableRecordFail implements Action {
    readonly type = ViewDatabaseActionTypes.InsertTableRecordFail;

    constructor(public payload: string) {}
}

export class DeleteTableRecords implements Action {
    readonly type = ViewDatabaseActionTypes.DeleteTableRecords;

    constructor(public payload: {databaseName: string, tableName: string, conditions: {attributeName: string, condition: string, value: string}}) { }
}

export class DeleteTableRecordsSuccess implements Action {
    readonly type = ViewDatabaseActionTypes.DeleteTableRecordsSuccess;
}

export class DeleteTableRecordsFail implements Action {
    readonly type = ViewDatabaseActionTypes.DeleteTableRecordsFail;

    constructor(public payload: string) { }
}



export type ViewDatabaseActions = GetDatabaseTables
    | GetDatabaseTablesSuccess
    | GetDatabaseTablesFail
    | CreateTable
    | CreateTableSuccess
    | CreateTableFail
    | DropTable
    | DropTableSuccess
    | DropTableFail
    | CreateIndex
    | CreateIndexSuccess
    | CreateIndexFail
    | GetTableRecords
    | GetTableRecordsSuccess
    | GetTableRecordsFail
    | InsertTableRecord
    | InsertTableRecordSuccess
    | InsertTableRecordFail
    | DeleteTableRecords
    | DeleteTableRecordsSuccess
    | DeleteTableRecordsFail;
