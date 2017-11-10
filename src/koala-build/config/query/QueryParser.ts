import * as _ from 'lodash';

import { IConfigQuery } from '.';

const kdirectiveRegex = /[a-zA-Z0-9_-$]+/;

export interface IQueryParser {
    parseQuery(query: string): IConfigQuery;
}

export function isValidKIdentifier(str: string) {
    return kdirectiveRegex.test(str);
}

export default class QueryParser implements IQueryParser {
    public parseQuery(query: string): IConfigQuery {
        // TODO: create the query parser here
        throw new Error('Not implemented');
    }
}
