export interface IForeignKey {
    referencedTableName: string;
    referencedAttributeName: string;
    attributeName: string;
};

export class ForeignKeyModel implements IForeignKey {
    referencedTableName: string;
    referencedAttributeName: string;
    attributeName: string;

    constructor(params: IForeignKey) {
        this.referencedTableName = params.referencedTableName;
        this.referencedAttributeName = params.referencedAttributeName;
        this.attributeName = params.attributeName;
    }
}