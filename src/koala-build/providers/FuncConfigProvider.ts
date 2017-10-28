import KoalaError from '../KoalaError';
import { IConfigProvider } from './ConfigProvider';

export default class FuncConfigProvider implements IConfigProvider {
    private readonly _func: () => object;

    constructor(configFunc: () => object) {
        if (!configFunc)
            throw new KoalaError('configFunc must be a valid function');

        this._func = configFunc;
    }

    public getConfig() {
        return this._func();
    }
}
