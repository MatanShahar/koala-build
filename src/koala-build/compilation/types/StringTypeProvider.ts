import * as _ from 'lodash';

import KoalaError from 'KoalaError';

import { IValueDescriptor } from 'compilation';
import TypeProvider from 'compilation/TypeProvider';
import TypeRegistry from 'compilation/TypeRegistry';
import { STRING_TYPE_NAME } from 'compilation/types';
import TypeSymbol from 'compilation/TypeSymbol';

export default class StringTypeProvider extends TypeProvider {
    private readonly _stringTypes: TypeSymbol[];

    constructor(stringTypes: TypeSymbol[] = null) {
        super();

        this._stringTypes = stringTypes === null 
            ? [ TypeRegistry.instance.get(STRING_TYPE_NAME) ]
            : this._stringTypes = stringTypes;
    }

    public supportsType(type: TypeSymbol): boolean {
        return _.some(this._stringTypes, t => type.equals(t));
    }

    public validateValue(value: IValueDescriptor): boolean {
        if (typeof value.value === 'string')
            return true;

        return value.value.hasOwnProperty('toString') &&
               typeof value.value.toString === 'function';
    }

    public resolveTypedValue(sourceValue: IValueDescriptor) {
        if (typeof sourceValue.value === 'string')
            return sourceValue.value;

        return sourceValue.value.toString();
    }
}
