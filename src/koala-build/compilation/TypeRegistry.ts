import TypeSymbol from 'compilation/TypeSymbol';


export default class TypeRegistry {
    private static _instance: TypeRegistry;

    private readonly _registry: { [key: string]: TypeSymbol };

    constructor() {
        this._registry = {};
    }

    public get(typeName: string) {
        if (this._registry.hasOwnProperty(typeName)) {
            let element = this._registry[typeName];
            if (element)
                return element;
        }

        let newSymbol = TypeSymbol.create(typeName);
        this._registry[typeName] = newSymbol;
        
        return newSymbol;
    }

    public static get instance() {
        if (TypeRegistry._instance === null)
            TypeRegistry._instance = new TypeRegistry();

        return TypeRegistry._instance;
    }
}
