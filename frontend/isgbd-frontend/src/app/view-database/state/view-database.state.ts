import { TableModel } from 'src/app/shared/models';

export interface ViewDatabaseState {
    tablesList: TableModel[];
    tableRecords: {key: string, value: string}[];
    tablesListIsLoading: boolean;
    selectedRecords: {data: string[], attributesList: string[]};
    selectedRecordsLoading: boolean;
    generateRecordsLoading: boolean;
    error: string;
}