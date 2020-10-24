import { DatabaseModel } from './../shared/models/database.model';
import { Action } from '@ngrx/store';

export enum SelectedDatabaseActionTypes {
    SelectDatabase = '[Database] Select Database',
    ClearSelectedDatabase = '[Database] Clear Database'
}

export class SelectDatabase implements Action {
    readonly type = SelectedDatabaseActionTypes.SelectDatabase;

    constructor(public payload: DatabaseModel) {}
}

export class ClearSelectedDatabase implements Action {
    readonly type = SelectedDatabaseActionTypes.ClearSelectedDatabase;
}

export type SelectedDatabaseActions = SelectDatabase 
    | ClearSelectedDatabase
