import { IConfigLookup } from './configLookup';

import { IConfigProvider } from '../providers/ConfigProvider';

export interface IConfigLocator {
    locate(lookup: IConfigLookup): IConfigProvider;
}
