import KoalaError from '../../KoalaError';
import IConfigResult from '../ConfigResult';
import fluentBuilder from './fluentBuilder';

import { IConfigQuery } from '.';
import { IConfigMap, options_t } from '../ConfigMap';
import { IFluentBuilder } from './fluentBuilder';
import { IQueryBuilder } from './queryBuilder';
import { IQueryParser } from './QueryParser';

type BuilderFactory = () => IQueryBuilder;
type query_t = IConfigQuery | ((builder: IFluentBuilder) => IFluentBuilder) | string;

export interface IConfigMapProxy {
    getValue(query: query_t, options?: options_t): any;
    get(query: query_t, options?: options_t): IConfigResult;

    getSourceMap(): IConfigMap;
}

class ConfigMapProxy implements IConfigMapProxy {
    private readonly _sourceMap: IConfigMap;

    constructor(
        sourceMap: IConfigMap, 
        private builderFactory: BuilderFactory = null, 
        private queryParser: IQueryParser = null
    ) {
        if (typeof sourceMap === 'undefined' || sourceMap === null)
            throw new KoalaError('sourceMap must have a value');

        if (!('get' in sourceMap) || !('getValue' in sourceMap))
            throw new KoalaError('sourceMap is not a valid ConfigMap');

        this._sourceMap = sourceMap;
    }

    public getValue(query: query_t, options?: options_t): any {
        let resolvedQuery = this.resolveQuery(query);
        return this._sourceMap.getValue(resolvedQuery, options);
    }

    public get(query: query_t, options?: options_t): IConfigResult {
        let resolvedQuery = this.resolveQuery(query);
        return this._sourceMap.get(resolvedQuery, options);
    }

    public getSourceMap(): IConfigMap {
        return this._sourceMap;
    }

    private resolveQuery(query: query_t): IConfigQuery {
        if (typeof query === 'undefined' || query === null)
            throw new KoalaError('query must have a value');

        if (typeof query === 'string')
            return this.resolveQueryFromString(query);

        if (typeof query === 'function')
            return this.resolveQueryFromFunction(query);

        return query;
    }

    private resolveQueryFromString(query: string) {
        if (!this.queryParser)
            throw new KoalaError('could not resolve query from a string, ' + 
                                'this operation is not supported by the current proxy');

        return this.queryParser.parseQuery(query);
    }

    private resolveQueryFromFunction(func: (b: IFluentBuilder) => IFluentBuilder) {
        if (!this.builderFactory)
            throw new KoalaError('could not resolve query from fluent expression, ' + 
                                 'this operation is not supported by the current proxy');

        let builder = fluentBuilder(this.builderFactory);
        return func(builder)();
    }
}

function createMapWrapper(builderFactory: BuilderFactory = null, queryParser: IQueryParser = null) {
    return function wrapMap(configMap: IConfigMap) {
        return new ConfigMapProxy(configMap, builderFactory, queryParser);
    };
}

const mapWrapper = createMapWrapper;
export default mapWrapper;
