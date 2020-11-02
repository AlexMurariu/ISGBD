export interface IIndex {
    indexName: string;
    keyLength: number;
    isUnique: number;
    indexType: string;
    indexAttribute: string;
}

export class IndexModel implements IIndex {
    indexName: string;
    keyLength: number;
    isUnique: number;
    indexType: string;
    indexAttribute: string;

    constructor(params: IIndex) {
        this.indexName = params.indexName;
        this.keyLength = params.keyLength;
        this.isUnique = params.isUnique;
        this.indexType = params.indexType;
        this.indexAttribute = params.indexAttribute;
    }
}