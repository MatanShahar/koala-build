import IConfigResult from './ConfigResult';
import Options, { IQueryOptions } from './QueryOptions';

type options_t = IQueryOptions | any | undefined | null;

/**
 * Core interface for config values retrival.
 */
export interface IConfigMap {
    /**
     * Gets a config value matching the given query.
     * @param query The query string.
     * @return The config value matching the query.
     */
    getValue(query: string, options?: options_t): any;

    /**
     * Gets a config value matching the given query as a config result.
     * @param query The query string.
     * @return A config result with the value matching the query.
     */
    get(query: string, options?: options_t): IConfigResult;
}

export default abstract class ConfigMap implements IConfigMap {
    public getValue(query: string, options?: options_t) {
        return this.get(query, options);
    }

    public get(query: string, options?: options_t): IConfigResult {
        const queryOptions = resolveQueryOptions(options);

        // TODO: this should pass a Query object, not a string.
        return this.getCore(query, queryOptions);
    }

    protected abstract getCore(query: string, options: IQueryOptions): IConfigResult;
}

export function resolveQueryOptions(options: options_t): IQueryOptions {
    if (typeof options === 'undefined')
        return Options.empty();

    if (options === null)
        return Options.optional();

    if (isOptionsObject(options))
        return options;

    return Options.default(options);
}

function isOptionsObject(options: options_t): boolean {
    if (options !== 'object')
        return false;

    return options.hasOwnProperty('isOptional') ||
           options.hasOwnProperty('defaultValue') ||
           options.hasOwnProperty('queryBase');
}
