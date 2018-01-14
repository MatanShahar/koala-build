import KoalaError from 'KoalaError';
import TypeProvider from './TypeProvider';
import TypeSymbol from './TypeSymbol';

import { IValueDescriptor } from 'compilation';

export default class CompilationEngine {
    private readonly _typeBindings: { [typeName: string]: TypeSymbol };
    private readonly _typeProviders: { [typeId: string]: TypeProvider[] };

    constructor() {
        this._typeBindings = {};
        this._typeProviders = { '': [] };
    }

    public resolveType(typeName: string): TypeSymbol {
        if (!typeName)
            throw new KoalaError('typeName must be defined');

        if (this._typeBindings[typeName])
            return this._typeBindings[typeName];

        return null;
    }

    public resolveValue(value: IValueDescriptor): object {
        let valueType = value.type;
        let providers = this.getProvidersFor(valueType);

        if (!providers.reduce((prev, curr) => prev || curr.length > 0, false))
            return null;

        return null;
    }

    public bindType(typeSymbol: TypeSymbol) {
        this.bindTypeName(typeSymbol.typeName, typeSymbol);
    }

    public bindTypes(types: { [name: string]: TypeSymbol }) {
        for (const key in types) {
            if (types.hasOwnProperty(key)) {
                const symbol = types[key];
                this.bindTypeName(key, symbol);
            }
        }
    }

    public bindTypeName(typeName: string, typeSymbol: TypeSymbol) {
        if (!typeName)
            throw new KoalaError('typeName must be defined');

        if (!typeSymbol || !(typeSymbol instanceof TypeSymbol))
            throw new KoalaError('typeSymbol must be an instance of TypeSymbol');

        if (this._typeBindings[typeName])
            throw new KoalaError(`a typeSymbol is already bound to '${typeName}'`);

        this._typeBindings[typeName] = typeSymbol;
    }

    public unbindTypeName(typeName: string) {
        if (!typeName)
            throw new KoalaError('typeName must be defined');

        delete this._typeBindings[typeName];
    }

    public addTypeProvider(provider: TypeProvider, typeSymbol?: TypeSymbol) {
        if (!provider || !(provider instanceof TypeProvider))
            throw new KoalaError('provider must be an instance of TypeProvider');

        if (typeSymbol && !(typeSymbol instanceof TypeSymbol))
            throw new KoalaError('typeSymbol must be an instance of TypeSymbol or null');

        let providerKey = typeSymbol ? typeSymbol.getTypeId() : '';
        let providerSet = this.getProviderSet(providerKey);

        providerSet.push(provider);
    }

    private getProviderSet(providerKey: string) {
        if (this._typeProviders.hasOwnProperty(providerKey)) {
            let providerSet = this._typeProviders[providerKey];
            if (providerSet !== undefined)
                return providerSet;
        }

        this._typeProviders[providerKey] = [];
        return this._typeProviders[providerKey];
    }

    private getProvidersFor(type: TypeSymbol): TypeProvider[][] {
        let providerKey = type.getTypeId();
        if (this._typeProviders.hasOwnProperty(providerKey)) {
            let providerSet = this._typeProviders[providerKey];
            if (providerSet !== undefined)
                return [ providerSet, this._typeProviders[''] ];
        }

        return [ this._typeProviders[''] ];
    }
}
