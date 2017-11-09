
export interface IConfigQuery {
    nameResolver?: string;
    path: string[];

    typeName?: string;
    isOptional: boolean;

    directives: string[];
}
