import * as fs from 'fs';
import * as path from 'path';

import * as glob from 'glob';
import * as _ from 'lodash';

import { IConfigProvider } from './ConfigProvider';
import JsonConfigProvider from './JsonConfigProvider';

function importLayeredJson(fileNameFragment: string, baseDir: string, pf: (path: string) => IConfigProvider) {
    const layers = parseLayers(fileNameFragment);
    var actuallFileName = path.resolve(baseDir, fileNameFragment);

    var provider = pf(actuallFileName);
    var tailObject = provider.getConfig();

    var currentObject = tailObject;
    for (var layer of layers.reverse()) {
        var newObject: any = { };
        newObject[layer] = currentObject;

        currentObject = newObject;
    }

    return currentObject;
}

function parseLayers(fragment: string) {
    const fragmentPath = path.normalize(fragment);
    const layers = fragmentPath.split(path.sep);
    layers.splice(layers.length - 1);

    const fileName = path.parse(fragmentPath).name;
    if (fileName.toLowerCase() !== 'index')
        layers.push(fileName);

    return layers;
}

export default class LayeredJsonConfigProvider implements IConfigProvider {
    private readonly _baseDirectory: string;

    constructor(baseDirectory: string) {
        this._baseDirectory = baseDirectory;
    }

    public getConfig(): any {
        const pf = (jpath) => JsonConfigProvider.fromFile(jpath);
        var subfiles = glob.sync('**/*.json');

        var mergeTarget = { };
        for (var subfile of subfiles) {
            _.merge(mergeTarget, importLayeredJson(subfile, this._baseDirectory, pf));
        }

        return mergeTarget;
    }
}
