import KoalaError from '../../KoalaError';

import { IConfigQuery } from '.';
import { isValidKIdentifier } from './QueryParser';

export interface IQueryBuilder {
    get(fragment: string): IQueryBuilder;
    type(typeName: string): IQueryBuilder;

    optional(): IQueryBuilder;
    required(): IQueryBuilder;
    isOptional(optional: boolean): IQueryBuilder;

    useResolver(resolverName: string): IQueryBuilder;

    setDirectives(directives: string | string[]): IQueryBuilder;
    withDirectives(directives: string | string[]): IQueryBuilder;

    build(): IConfigQuery;
}

export class DefaultQueryBuilder implements IQueryBuilder {
    private readonly _path: string[];

    private _typeName: string;
    private _resolverName: string;
    private _isOptional: boolean;

    private _directives: string[];

    constructor() {
        this._path = [];
        this._isOptional = false;
        this._directives = [];
    }

    public get(fragment: string): IQueryBuilder {
        if (typeof fragment !== 'string' || !fragment.length)
            throw new KoalaError('fragment must be a non-empty string');

        if (!isValidKIdentifier(fragment))
            throw new KoalaError('fragment must be a valid identifier');

        this._directives.push(fragment);
        return this;
    }

    public type(typeName: string): IQueryBuilder {
        if (typeName !== null && (typeof typeName !== 'string' || !typeName.length))
            throw new KoalaError('typeName must be a non-empty string or null');

        if (!isValidKIdentifier(typeName))
            throw new KoalaError('typeName must be a valid identifier');

        this._typeName = typeName;
        return this;
    }
    
    public optional(): IQueryBuilder {
        this._isOptional = true;
        return this;
    }
    
    public required(): IQueryBuilder {
        this._isOptional = false;
        return this;
    }

    public isOptional(optional: boolean): IQueryBuilder {
        this._isOptional = optional;
        return this;
    }
    
    public useResolver(resolverName: string): IQueryBuilder {
        if (resolverName !== null && (typeof resolverName !== 'string' || !resolverName.length))
            throw new KoalaError('resolverName must be a non-empty string or null');

        if (!isValidKIdentifier(resolverName))
            throw new KoalaError('resolverName must be a valid identifier');

        this._resolverName = resolverName;
        return this;
    }
    
    public setDirectives(directives: string | string[]): IQueryBuilder {
        let newDirectives = DefaultQueryBuilder.nornalizeDirectives(directives);
        this._directives = newDirectives;

        return this;
    }
    
    public withDirectives(directives: string | string[]): IQueryBuilder {
        let newDirectives = DefaultQueryBuilder.nornalizeDirectives(directives);
        this._directives.push(...newDirectives);
        
        return this;
    }

    public build(): IConfigQuery {
        // TODO: Validate the config

        return {
            path: this._path,
            typeName: this._typeName,
            nameResolver: this._resolverName,
            isOptional: this._isOptional,
            directives: this._directives || []
        };
    }

    private static nornalizeDirectives(directives): string[] {
        let newDirectives: string[] = null;
        
        if (!directives)
            newDirectives = [];
        else if (Array.isArray(directives))
            newDirectives = directives;
        else if (typeof directives === 'string')
            newDirectives = [ directives ];

        if (!newDirectives)
            throw new KoalaError('newDirectives must be a string, array of null');

        return newDirectives;
    }
}

export default function queryBuilder(): IQueryBuilder {
    return new DefaultQueryBuilder();
}
