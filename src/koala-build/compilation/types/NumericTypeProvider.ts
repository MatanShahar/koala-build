import * as _ from 'lodash';

import KoalaError from 'KoalaError';

import { IValueDescriptor } from 'compilation';
import TypeProvider from 'compilation/TypeProvider';
import TypeRegistry from 'compilation/TypeRegistry';
import * as types from 'compilation/types';
import TypeSymbol from 'compilation/TypeSymbol';

export default class NumericTypeProvider extends TypeProvider {
    private readonly _numericTypes: TypeSymbol[];

    constructor(numericTypes: TypeSymbol[] = null) {
        super();

        this._numericTypes = numericTypes === null ? [ 
                TypeRegistry.instance.get(types.NUMBER_TYPE_NAME),
                TypeRegistry.instance.get(types.FLOAT_TYPE_NAME),
                TypeRegistry.instance.get(types.INTEGER_TYPE_NAME)
            ] : this._numericTypes = numericTypes;
    }

    public supportsType(type: TypeSymbol): boolean {
        return _.some(this._numericTypes, t => type.equals(t));
    }

    public validateValue(value: IValueDescriptor): boolean {
        return typeof value.value === 'number' ||
               typeof value.value === 'string' ||
               typeof value.value === 'boolean';
    }

    public resolveTypedValue(sourceValue: IValueDescriptor) {
        if (typeof sourceValue.value === 'number')
            return sourceValue.value;

        if (typeof sourceValue.value === 'string')
            return parseFloat(sourceValue.value);

        if (typeof sourceValue.value === 'boolean')
            return sourceValue.value ? 1 : 0;

        return NaN;
    }
}
