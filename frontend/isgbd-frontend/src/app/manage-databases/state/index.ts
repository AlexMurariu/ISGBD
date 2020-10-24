import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromManageDatabases from './manage-databases.state';
import * as fromManageDatabasesReducer from './manage-databases.reducer';
import * as fromRoot from '../../state';

export interface ManageDatabasesState {
    manageDatabases: fromManageDatabases.ManageDatabasesState; 
}

export const manageDatabasesReducer: ActionReducerMap<ManageDatabasesState> = {
    manageDatabases: fromManageDatabasesReducer.reducer
};

export interface State extends fromRoot.State {
    manageDatabases: ManageDatabasesState;
}

const getManageDatabasesFeatureState = createFeatureSelector<ManageDatabasesState>('manageDatabases');

export const getDatabaseList = createSelector(
    getManageDatabasesFeatureState,
    state => state.manageDatabases.databaseList
);

export const getDatabaseListError = createSelector(
    getManageDatabasesFeatureState,
    state => state.manageDatabases.error
);