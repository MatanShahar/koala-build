
export interface IQueryOptions {
    isOptional?: boolean;
    defaultValue?: any;

    queryBase?: string;
}

const Options = {
    default: (defaultValue): IQueryOptions => ({ defaultValue }),
    optional: (): IQueryOptions => ({ isOptional: true }),
    rebase: (queryBase): IQueryOptions => ({ queryBase }),
    empty: (): IQueryOptions => ({ isOptional: false, defaultValue: undefined })
};

export default Options;
