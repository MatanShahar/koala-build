import * as uuid4 from 'uuid/v4';

export default class TypeSymbol {
    private constructor(private _id: string, private _typeName: string) {

    }

    public equals(other: TypeSymbol) {
        return this._id === other._id;
    }

    public getTypeId() {
        return this._id;
    }

    public get typeName() {
        return this._typeName;
    }

    public static create(typeName: string): TypeSymbol {
        const nextTypeId = uuid4();

        return new TypeSymbol(nextTypeId, typeName);
    }
}
