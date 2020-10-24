export interface ITableModel {
    tableName: string;
}

export class TableModel {
    tableName: string;

    constructor(params: ITableModel) {
        this.tableName = params.tableName;
    }
}