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
}