import TypeRegistry from 'compilation/TypeRegistry';
import TypeSymbol from 'compilation/TypeSymbol';

export const FLOAT_TYPE_NAME = 'float';
export const INTEGER_TYPE_NAME = 'int';
export const NUMBER_TYPE_NAME = 'number';
export const BOOLEAN_TYPE_NAME = 'boolean';
export const STRING_TYPE_NAME = 'string';
export const OBJECT_TYPE_NAME = 'object';
export const ARRAY_TYPE_NAME = 'array';
export const PATH_TYPE_NAME = 'path';

export default {
    [FLOAT_TYPE_NAME]: TypeRegistry.instance.get(FLOAT_TYPE_NAME),
    [INTEGER_TYPE_NAME]: TypeRegistry.instance.get(INTEGER_TYPE_NAME),
    [NUMBER_TYPE_NAME]: TypeRegistry.instance.get(NUMBER_TYPE_NAME),
    [BOOLEAN_TYPE_NAME]: TypeRegistry.instance.get(BOOLEAN_TYPE_NAME),
    [STRING_TYPE_NAME]: TypeRegistry.instance.get(STRING_TYPE_NAME),
    [OBJECT_TYPE_NAME]: TypeRegistry.instance.get(OBJECT_TYPE_NAME),
    [ARRAY_TYPE_NAME]: TypeRegistry.instance.get(ARRAY_TYPE_NAME),
    [PATH_TYPE_NAME]: TypeRegistry.instance.get(PATH_TYPE_NAME),
};
