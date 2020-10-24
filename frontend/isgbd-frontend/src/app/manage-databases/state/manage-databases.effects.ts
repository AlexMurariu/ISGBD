import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { ManageDatabaseService } from '../service/manage-databases.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as manageDatabasesActions from './manage-databases.actions';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

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
                catchError(err => of(new manageDatabasesActions.GetDatabasesFail('Could not load existing databases!')))
            )
        )
    )
}