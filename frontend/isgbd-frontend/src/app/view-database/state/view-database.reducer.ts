import { ViewDatabaseActions, ViewDatabaseActionTypes } from './view-database.actions';
import { ViewDatabaseState } from "./view-database.state";

const initialState: ViewDatabaseState = {
    tablesList: null,
    tablesListIsLoading: false,
    error: ''
};

export function reducer(state = initialState, action: ViewDatabaseActions): ViewDatabaseState {
    switch (action.type) {
        case ViewDatabaseActionTypes.GetDatabaseTables:
            return {
                ...state,
                tablesListIsLoading: true
            }

        case ViewDatabaseActionTypes.GetDatabaseTablesSuccess:
            return {
                tablesList: action.payload,
                tablesListIsLoading: false,
                error: ''
            }

        case ViewDatabaseActionTypes.GetDatabaseTablesFail:
            return {
                tablesList: [],
                tablesListIsLoading: false,
                error: action.payload
            }

        default:
            return state;
    }
}