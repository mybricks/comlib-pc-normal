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
    /** 编辑态右侧选中的状态 */
    _editSelectId_?: string
}