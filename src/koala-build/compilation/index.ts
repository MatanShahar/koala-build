import { IBuildInfo } from 'KoalaBuild';
import { IConfigLoader } from 'loaders';

import TypeSymbol from './TypeSymbol';

export interface IValueDescriptor {
    key: IKeyDescriptor;
    path: IKeyDescriptor[];

    value: any;
    type: TypeSymbol;
}

export interface ICompilerContext {
    buildInfo: IBuildInfo;
    loader: IConfigLoader;
}

export interface IKeyDescriptor {
    name: string;
    text: string;
    typeName: string;
    directives: string[];
}
