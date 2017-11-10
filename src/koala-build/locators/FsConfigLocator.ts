import * as fs from 'fs';
import * as path from 'path';

import KoalaError from '../KoalaError';

import { IConfigLocator } from './ConfigLocator';
import { IConfigLookup, LookupObject } from './configLookup';

import { IConfigProvider } from '../providers/ConfigProvider';

import JsonConfigProvider from '../providers/JsonConfigProvider';
import LayeredJsonConfigProvider from '../providers/LayeredJsonConfigProvider';

export default class FsConfigLocator implements IConfigLocator {
    private readonly _baseDir: string;
    private readonly _options: IFsConfigLocatorOptions;

    constructor(baseDir: string, options?: IFsConfigLocatorOptions) {
        if (!path.isAbsolute(baseDir))
            throw new KoalaError('baseDir must be an absolute path to a directory');

        if (!fs.existsSync(baseDir))
            throw new KoalaError('baseDir is refering to a non existent path');

        this._baseDir = baseDir;
        this._options = options || defaultOptions;

        // TODO: Check if options are valid
    }

    public locate(lookup: IConfigLookup): IConfigProvider {
        const lookupPath = this.resolveLookupPath(lookup);

        let dirPath = path.join(this._baseDir, lookupPath.dir, lookupPath.name);
        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory())
            return new LayeredJsonConfigProvider(dirPath);

        let jsonName = `${lookupPath.name}.json`;
        let jsonPath = path.join(this._baseDir, lookupPath.dir, jsonName);
        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isFile())
            return JsonConfigProvider.fromFile(jsonPath);

        // Do not throw here, it's a lookup, lookups failing is nothing exceptional
        return null;
    }

    private resolveLookupPath(lookup: IConfigLookup) {
        let objectPath = this.resolveLookupObjectPath(lookup.object);
        return { dir: objectPath, name: lookup.objectName };
    }

    private resolveLookupObjectPath(lookup: LookupObject): string {
        switch (lookup) {
            case LookupObject.Configuration:
                return this._options.configurationDirName;

            case LookupObject.Environment:
                return this._options.environmentDirName;

            case LookupObject.Fragment:
                return this._options.fragmentsDirName;

            case LookupObject.Option:
                return this._options.optionsDirName;

            case LookupObject.TargetArch:
                return FsConfigLocator.joinPrefix(
                    this._options.targetParametersDirPrefix, 
                    this._options.targetArchDirName);

            case LookupObject.TargetHost:
                return FsConfigLocator.joinPrefix(
                    this._options.targetParametersDirPrefix, 
                    this._options.targetHostDirName);

            case LookupObject.TargetOs:
                return FsConfigLocator.joinPrefix(
                    this._options.targetParametersDirPrefix, 
                    this._options.targetOsDirName);
        }

        throw new KoalaError('Lookup object is invalid or unsupported');
    }

    private static joinPrefix(prefix: string, str: string) {
        if (prefix.endsWith('/'))
            return path.join(prefix, str);

        return prefix + str;
    }
}

export interface IFsConfigLocatorOptions {
    environmentDirName: string;
    configurationDirName: string;

    targetParametersDirPrefix: string;
    targetOsDirName: string;
    targetArchDirName: string;
    targetHostDirName: string;
    
    optionsDirName: string;
    fragmentsDirName: string;
}

const defaultOptions: IFsConfigLocatorOptions = {
    environmentDirName: 'environment',
    configurationDirName: 'configuration',
    targetParametersDirPrefix: 'targets/',
    targetOsDirName: 'os',
    targetArchDirName: 'arch',
    targetHostDirName: 'host',
    optionsDirName: 'misc',
    fragmentsDirName: 'imports'
};
