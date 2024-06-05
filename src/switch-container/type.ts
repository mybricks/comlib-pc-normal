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
    /** 编辑态，默认数组选择器，active的类名，类名来自editor内部，编译后是会变化的，这里记录一下 */
    _activeArrayClass?: string
}