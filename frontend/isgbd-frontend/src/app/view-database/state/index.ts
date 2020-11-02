import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromViewDatabase from './view-database.state'
import * as fromViewDatabaseReducer from './view-database.reducer';
import * as fromRoot from '../../state';

export interface ViewDatabaseState {
    viewDatabase: fromViewDatabase.ViewDatabaseState;
}

export const viewDatabaseReducer: ActionReducerMap<ViewDatabaseState> = {
    viewDatabase: fromViewDatabaseReducer.reducer 
};

export interface State extends fromRoot.State {
    viewDatabase: ViewDatabaseState;
};

const getViewDatabaseFeatureState = createFeatureSelector<ViewDatabaseState>('viewDatabase');

export const getTablesList = createSelector(
    getViewDatabaseFeatureState,
    state => state.viewDatabase.tablesList
);

export const getTablesListError = createSelector(
    getViewDatabaseFeatureState,
    state => state.viewDatabase.error
);

export const getTablesListLoadingStatus = createSelector(
    getViewDatabaseFeatureState,
    state => state.viewDatabase.tablesListIsLoading
);