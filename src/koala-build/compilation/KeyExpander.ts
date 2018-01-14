import { IKeyDescriptor } from 'compilation';
import KoalaError from 'KoalaError';

const keyRegex = /^([a-zA-Z0-9_@~\-\(\)]+)(?::([a-zA-Z0-9_@~\-\(\)]+))?(?:\|(.+))?$/;

function splitDirectives(rawDirectives: string) {
    let result: string[] = [];
    if (rawDirectives === '' || rawDirectives === undefined)
        return result;

    let commaParity = false;
    let nextString = '';
    
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < rawDirectives.length; i++) {
        const char = rawDirectives[i];
        const isComma = char === ',';

        if (isComma) {
            if (commaParity)
                nextString += ',';

            commaParity = !commaParity;
        } else {
            if (commaParity) {
                if (nextString !== '')
                    result.push(nextString);

                nextString = '';
            }

            nextString += char;
            commaParity = false;
        }
    }

    if (nextString !== '')
        result.push(nextString);

    return result;
}

export default class KeyExpander {
    public expandKey(key: string): IKeyDescriptor {
        // A key has the following syntax: [name]:[type]|[directives]
        // An identifier (name / type) can have the following characters:
        //  : Letters: A-Z, a-z
        //  : Numbers: 0-9
        //  : Punctuation: _ - ( ) @ ~
        //
        // Directives can be any string separated by comma (,).
        // Commas can be escaped by using a double comma (,,)

        if (!keyRegex.test(key))
            throw new KoalaError('key does not have a valid key format');

        let regex = keyRegex.exec(key);
        let [keySource, keyName, keyType, rawDirectives] = regex;

        return {
            name: keyName,
            text: keySource || '',
            typeName: keyType || '',
            directives: splitDirectives(rawDirectives)
        };
    }
}
