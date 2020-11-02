import { SelectedDatabaseState } from './selected-database.state';
import { State } from './index';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectedDatabaseState = createFeatureSelector<State, SelectedDatabaseState>('selectedDatabase');

export const selectSelectedDatabase = createSelector(
    selectedDatabaseState,
    state => state.selectedDatabase
)