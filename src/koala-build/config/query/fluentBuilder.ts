import { IConfigQuery } from '.';
import { IQueryBuilder } from './queryBuilder';

export interface IFluentBuilder {
    [fragment: string]: IFluentBuilder;

    $optional: IFluentBuilder;
    $required: IFluentBuilder;

    (): IConfigQuery;
}

type BuilderFactory = () => IQueryBuilder;
export default function fluentBuilder(builderFactory: BuilderFactory): IFluentBuilder {
    const proxyHandler = {
        get: (target: any, name: string) => {
            if (name in target) {
                let member = target[name];
                if (typeof member === 'function')
                    member();

                return target;
            }

            // tslint:disable-next-line:variable-name
            let builder_: IQueryBuilder = target.__builder$__;
            target.__builder$__ = builder_.get(name);

            return target;
        },
        apply: (target: any, thisArg: any, argsList: any[]) => {
            return (target.__builder$__ as IQueryBuilder).build();
        }
    };

    let builder = builderFactory();
    let dummy = { __builder$__: builder };

    return new Proxy(dummy, proxyHandler);
}
