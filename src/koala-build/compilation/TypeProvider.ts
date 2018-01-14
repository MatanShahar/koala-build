import { IValueDescriptor } from 'compilation';
import TypeSymbol from 'compilation/TypeSymbol';

export default abstract class TypeProvider {
    public abstract supportsType(type: TypeSymbol): boolean;

    public abstract validateValue(value: IValueDescriptor): boolean;
    public abstract resolveTypedValue(sourceValue: IValueDescriptor): any;
}
