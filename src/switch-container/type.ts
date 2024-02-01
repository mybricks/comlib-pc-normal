export interface Status {
    id: string;
    title: string;
    value: boolean | number | string;
    visible: boolean;
}

export interface Data {
    statusList: Status[];
    useDefaultStatus: boolean;
    value: boolean | number | string;
}