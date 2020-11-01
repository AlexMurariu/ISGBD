import { stat } from 'fs';
import { ManageDatabasesActions, ManageDatabasesActionTypes } from './manage-databases.actions';
import { ManageDatabasesState } from './manage-databases.state';

const initialState: ManageDatabasesState = {
    databaseList: null,
    databaseIsLoading: false,
    databaseActionIsLoading: false,
    error: ''
};

export function reducer(state = initialState, action: ManageDatabasesActions): ManageDatabasesState {
    switch(action.type) {
        case ManageDatabasesActionTypes.GetDatabases:
            return {
                ...state,
                databaseIsLoading: true
            }
        case ManageDatabasesActionTypes.GetDatabasesSuccess: 
            return {
                ...state,
                databaseList: action.payload,
                databaseIsLoading: false,
                error: ''
            };

        case ManageDatabasesActionTypes.GetDatabasesFail:
            return {
                ...state,
                databaseList: [],
                databaseIsLoading: false,
                error: action.payload
            }

        case ManageDatabasesActionTypes.DeleteDatabase:
            return {
                ...state,
                databaseActionIsLoading: true
            }

        case ManageDatabasesActionTypes.DeleteDatabaseSuccess: {
            let databaseList = [...state.databaseList];
            databaseList = databaseList.filter((databaseName => databaseName !== action.payload));

            return {
                ...state,
                databaseActionIsLoading: false,
                databaseList
            }
        }

        case ManageDatabasesActionTypes.DeleteDatabaseFail:
            return {
                ...state,
                databaseActionIsLoading: false
            }

        default:
            return state;
    }
}