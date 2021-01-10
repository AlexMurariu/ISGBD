import { TableModel } from 'src/app/shared/models';
import { ViewDatabaseActions, ViewDatabaseActionTypes } from './view-database.actions';
import { ViewDatabaseState } from "./view-database.state";

const initialState: ViewDatabaseState = {
    tablesList: null,
    tableRecords: null,
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
                ...state,
                tablesList: action.payload,
                tablesListIsLoading: false,
                error: ''
            }

        case ViewDatabaseActionTypes.GetDatabaseTablesFail:
            return {
                ...state,
                tablesList: [],
                tablesListIsLoading: false,
                error: action.payload
            }
        
        case ViewDatabaseActionTypes.DropTableSuccess: {
            const tableName = action.payload;
            let tablesList = [ ...state.tablesList ];

            tablesList = tablesList.filter((table: TableModel) => table.tableName !== tableName);

            return {
                ...state,
                tablesList
            }
        }

        case ViewDatabaseActionTypes.CreateIndexSuccess:
        case ViewDatabaseActionTypes.CreateTableSuccess: 
            return {
                ...state,
                tablesList: action.payload
            }

        case ViewDatabaseActionTypes.GetTableRecordsSuccess:
            return {
                ...state,
                tableRecords: action.payload
            }

        default:
            return state;
    }
}