import KoalaError from '../KoalaError';
import { IConfigProvider } from './ConfigProvider';

export default class ObjectConfigProvider implements IConfigProvider {
    private readonly _configObj: object;

    constructor(configObj: object) {
        if (!configObj)
            throw new KoalaError('configObj must be have a value');

        this._configObj = configObj;
    }

    public getConfig() {
        return this._configObj;
    }
}
