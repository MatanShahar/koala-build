
/**
 * An interface representing the result of a query.
 */
interface IConfigResult {
    /** The query result value. */
    value: any;

    hasValue: boolean;    

    sourceQuery: string;
    targetQuery: string;

    isAlias: boolean;
}

export default IConfigResult;
