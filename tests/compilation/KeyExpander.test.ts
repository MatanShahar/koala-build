import { expect } from 'chai';
import { IKeyDescriptor } from 'compilation';
import KeyExpander from 'compilation/KeyExpander';

describe('KeyExpander', () => {
    describe('#expandKey()', () => {
        const expander = new KeyExpander();
        const testSubjects: { [key: string]: IKeyDescriptor } = {
            'simpleKey': makeKey('simpleKey'),
            'with-type:type': makeKey('with-type', 'type'),
            'directive|d1': makeKey('directive', '', ['d1']),
            'dir-and-type:type|d1': makeKey('dir-and-type', 'type', ['d1']),
            'directive-split|d1,d2,d3': makeKey('directive-split', '', ['d1', 'd2', 'd3']),
            'escape|d1,,d2,d3': makeKey('escape', '', ['d1,d2', 'd3']),
            'escape|d1,,,d2,d3': makeKey('escape', '', ['d1,', 'd2', 'd3']),
            'escape|d1,,,,d2,d3': makeKey('escape', '', ['d1,,d2', 'd3']),
        };

        for (const sourceKey in testSubjects) {
            if (testSubjects.hasOwnProperty(sourceKey)) {
                const targetKey = testSubjects[sourceKey];
                const test = expander.expandKey(sourceKey);

                it(`test subject [${sourceKey}]`, () => {
                    expect(test.name).equals(targetKey.name);
                    expect(test.typeName).equals(targetKey.typeName);
                    expect(test.directives).deep.equals(targetKey.directives);
                });
            }
        }
    });
});

function makeKey(name: string, typeName: string = '', directives: string[] = []): IKeyDescriptor {
    return { name, typeName, directives, text: '' };
}
