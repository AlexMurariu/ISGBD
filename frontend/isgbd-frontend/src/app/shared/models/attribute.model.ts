export interface IAttribute {
    attributeName: string;
    type: string;
    length?: string;
    isNull?: string;
}

export class AttributeModel implements IAttribute {
    attributeName: string;
    type: string;
    length?: string;
    isNull?: string;

    constructor(params: IAttribute) {
        this.attributeName = params.attributeName;
        this.type = params.type;
        this.length = params.attributeName;
        this.isNull = params.isNull;
    }
}