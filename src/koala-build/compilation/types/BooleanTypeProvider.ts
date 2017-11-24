import * as _ from 'lodash';

import KoalaError from 'KoalaError';

import { IValueDescriptor } from 'compilation';
import TypeProvider from 'compilation/TypeProvider';
import TypeRegistry from 'compilation/TypeRegistry';
import { BOOLEAN_TYPE_NAME } from 'compilation/types';
import TypeSymbol from 'compilation/TypeSymbol';

export default class StringTypeProvider extends TypeProvider {
    private readonly _booleanTypes: TypeSymbol[];

    constructor(booleanTypes: TypeSymbol[] = null) {
        super();

        this._booleanTypes = booleanTypes === null 
            ? [ TypeRegistry.instance.get(BOOLEAN_TYPE_NAME) ]
            : this._booleanTypes = booleanTypes;
    }

    public supportsType(type: TypeSymbol): boolean {
        return _.some(this._booleanTypes, t => type.equals(t));
    }

    public validateValue(value: IValueDescriptor): boolean {
        return this.resolveInternal(value) !== undefined;
    }

    public resolveTypedValue(sourceValue: IValueDescriptor) {
        const xeValue = this.resolveInternal(sourceValue);
        if (xeValue === undefined)
            return false;

        return xeValue;
    }

    private resolveInternal(sourceValue: IValueDescriptor): boolean {
        if (typeof sourceValue.value === 'boolean')
            return sourceValue.value;

        if (typeof sourceValue.value === 'number')
            return sourceValue.value !== 0;

        if (typeof sourceValue.value === 'string') {
            const testStr = sourceValue.value.toLowerCase();
            return testStr === 'true' ? true : testStr === 'false' ? false : undefined;
        }

        return undefined;
    }
}
