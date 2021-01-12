import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { ViewDatabaseService } from '../service/view-database.service';
import * as viewDatabaseActions from './view-database.actions';
import { TableModel } from 'src/app/shared/models';
import { AddToNotification } from 'src/app/state/notification.actions';
import { NotificationModel } from 'src/app/shared/models/notification.model';

@Injectable()
export class ViewDatabaseEffects {
    constructor(
        private readonly viewDatabaseService: ViewDatabaseService,
        private readonly actions$: Actions
    ) {}

    @Effect()
    getDatabaseTables$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.GetDatabaseTables),
        mergeMap((action: viewDatabaseActions.GetDatabaseTables) => 
            this.viewDatabaseService.getDatabaseTables(action.payload).pipe(
                switchMap((tablesList: TableModel[]) => {
                        return [
                            new viewDatabaseActions.GetDatabaseTablesSuccess(tablesList)
                        ]
                    }
                ),
                catchError(err => 
                    of(
                        new viewDatabaseActions.GetDatabaseTablesFail('Could not load tables'),
                        new AddToNotification(NotificationModel.createErrorNotification('', 'Could not load tables'))
                    )
                )
            )
        )
    )

    @Effect()
    dropTable$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.DropTable),
        mergeMap((action: viewDatabaseActions.DropTable) => 
            this.viewDatabaseService.dropTable(action.payload.databaseName, action.payload.tableName).pipe(
                switchMap((tableName: string) => {
                        return [
                            new viewDatabaseActions.DropTableSuccess(tableName)
                        ]
                    }
                ),
                catchError(err =>  {
                    if (err.status === 405) {
                        return of(
                            new viewDatabaseActions.DropTableFail("Can't delete table, check if there are other tables referenced by the foreign key!"),
                            new AddToNotification(NotificationModel.createErrorNotification('', "Can't delete table, check if there are other tables referenced by the foreign key!"))
                        )
                    }
                    return of(
                        new viewDatabaseActions.DropTableFail('Table does not exist in database!'),
                        new AddToNotification(NotificationModel.createErrorNotification('', 'Table does not exist in database!'))
                        )
                    }
                )
            )
        )
    )

    @Effect()
    createTable$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.CreateTable),
        mergeMap((action: viewDatabaseActions.CreateTable) => 
            this.viewDatabaseService.createTable(action.payload.databaseName, action.payload.table).pipe(
                switchMap((tableList: TableModel[]) => {
                        return [
                            new viewDatabaseActions.CreateTableSuccess(tableList)
                        ]
                    }
                ),
                catchError(err =>  {
                    if (err.status === 400) {
                        return of (
                            new viewDatabaseActions.CreateTableFail("Table already exists!"),
                            new AddToNotification(NotificationModel.createErrorNotification('', "Table already exists!"))
                            )
                    }
                    return of(
                        new viewDatabaseActions.CreateTableFail("Can't create table!"),
                        new AddToNotification(NotificationModel.createErrorNotification('', "Can't create table!"))
                        )
                    }
                )
            )
        )
    )

    @Effect()
    createIndex$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.CreateIndex),
        mergeMap((action: viewDatabaseActions.CreateIndex) => 
            this.viewDatabaseService.createIndex(action.payload.databaseName, action.payload.tableName, action.payload.index).pipe(
                switchMap((tableList: TableModel[]) => {
                        return [
                            new viewDatabaseActions.CreateIndexSuccess(tableList),
                            new AddToNotification(NotificationModel.createSuccessNotification('', "Index created!"))
                        ]
                    }
                ),
                catchError(err =>  {
                    return of(
                        new viewDatabaseActions.CreateIndexFail("Can't create index!"),
                        new AddToNotification(NotificationModel.createErrorNotification('', "Can't create index!"))
                        )
                    }
                )
            )
        )
    )

    @Effect()
    getTableRecords$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.GetTableRecords),
        mergeMap((action: viewDatabaseActions.GetTableRecords) => 
            this.viewDatabaseService.getTableRecords(action.payload.databaseName, action.payload.tableName).pipe(
                switchMap((recordsList: {key: string, value: string}[]) => {
                        return [
                            new viewDatabaseActions.GetTableRecordsSuccess(recordsList)
                        ]
                    }
                ),
                catchError(err =>  {
                    return of(
                        new viewDatabaseActions.GetTableRecordsFail("Something went worng, can't load table records!"),
                        new AddToNotification(NotificationModel.createErrorNotification('', "Something went worng, can't load table records!"))
                        )
                    }
                )
            )
        )
    )

    @Effect()
    insertTableRecord$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.InsertTableRecord),
        mergeMap((action: viewDatabaseActions.InsertTableRecord) => 
            this.viewDatabaseService.insertTableRecord(action.payload.databaseName, action.payload.tableName, action.payload.value).pipe(
                switchMap(data => {
                        return [
                            new AddToNotification(NotificationModel.createSuccessNotification('', 'Record inserted successfully!'))
                        ]
                    }
                ),
                catchError(err =>  {
                    return of(
                        new viewDatabaseActions.InsertTableRecordFail(err.error),
                        new AddToNotification(NotificationModel.createErrorNotification('', err.error))
                        )
                    }
                )
            )
        )
    )

    @Effect()
    deleteTableRecords$: Observable<Action> = this.actions$.pipe(
        ofType(viewDatabaseActions.ViewDatabaseActionTypes.DeleteTableRecords),
        mergeMap((action: viewDatabaseActions.DeleteTableRecords) => 
            this.viewDatabaseService.deleteTableRecord(action.payload.databaseName, action.payload.tableName, action.payload.conditions).pipe(
                switchMap(data => {
                        return [
                            new AddToNotification(NotificationModel.createSuccessNotification('', 'Records deleted successfully!'))
                        ]
                    }
                ),
                catchError(err =>  {
                    return of(
                        new viewDatabaseActions.DeleteTableRecordsFail(err.error.text),
                        new AddToNotification(NotificationModel.createErrorNotification('', err.error))
                        )
                    }
                )
            )
        )
    )
}