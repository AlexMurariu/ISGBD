import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { ManageDatabaseService } from '../service/manage-databases.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as manageDatabasesActions from './manage-databases.actions';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { AddToNotification } from 'src/app/state/notification.actions';
import { NotificationModel } from 'src/app/shared/models/notification.model';

@Injectable()
export class ManageDatabasesEffects {

    constructor(
        private readonly manageDatabasesService: ManageDatabaseService,
        private readonly actions$: Actions
    ) {}

    @Effect()
    getDatabases$: Observable<Action> = this.actions$.pipe(
        ofType(manageDatabasesActions.ManageDatabasesActionTypes.GetDatabases),
        mergeMap((action: manageDatabasesActions.GetDatabases) => 
            this.manageDatabasesService.getDatabases().pipe(
                switchMap((databaseList: string[]) => {
                        return [
                            new manageDatabasesActions.GetDatabasesSuccess(databaseList)
                        ]
                    }
                ),
                catchError(err => 
                    of(
                        new manageDatabasesActions.GetDatabasesFail('Could not load existing databases'), 
                        new AddToNotification(NotificationModel.createErrorNotification('', 'Could not load existing databases'))
                    )
                )
            )
        )
    )

    @Effect()
    deleteDatabase$: Observable<Action> = this.actions$.pipe(
        ofType(manageDatabasesActions.ManageDatabasesActionTypes.DeleteDatabase),
        mergeMap((action: manageDatabasesActions.DeleteDatabase) => 
            this.manageDatabasesService.deleteDatabase(action.payload).pipe(
                switchMap((databaseName: string) => {
                        return [
                            new manageDatabasesActions.DeleteDatabaseSuccess(databaseName),
                            new AddToNotification(NotificationModel.createSuccessNotification('', 'Database deleted successfully'))
                        ];
                    }
                ),
                catchError(err => {
                    if (err.status === 404) {
                        return of(
                            new manageDatabasesActions.DeleteDatabaseFail('Database does not exists'), 
                            new AddToNotification(NotificationModel.createErrorNotification('', 'Database does not exists'))
                            );
                    }
                        
                    return of(
                        new manageDatabasesActions.DeleteDatabaseFail('Could not delete database'), 
                        new AddToNotification(NotificationModel.createErrorNotification('', 'Could not delete database'))
                        );
                    }
                )
            )
        )
    )
}