export interface IBuildInfo {
    configuration: string;
    environment: string;
    target: ITargetInfo;

    options: string[];
}

export interface ITargetInfo {
    architecture: string;
    operatingSystem: string;
    processHost: string;
}
