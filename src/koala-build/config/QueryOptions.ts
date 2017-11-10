
export interface IQueryOptions {
    isOptional?: boolean;
    defaultValue?: any;

    queryBase?: string[];
}

// tslint:disable-next-line:variable-name
const Options = {
    default: (defaultValue: any): IQueryOptions => ({ defaultValue }),
    optional: (): IQueryOptions => ({ isOptional: true }),
    rebase: (queryBase: string[]): IQueryOptions => ({ queryBase }),
    empty: (): IQueryOptions => ({ isOptional: false, defaultValue: undefined })
};

export default Options;
