import { TreeSelect } from 'antd';
import { InputIds, OutputIds } from '../types';
import { Data } from './types';

const treeSelectEditors = {
    title: '树选择配置',
    items: [
        {
            title: '默认展开所有树节点',
            type: 'Switch',
            value: {
                get({ data }: EditorResult<Data>) {
                    return data.config.treeDefaultExpandAll;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                    data.config.treeDefaultExpandAll = value;
                }
            }
        },
        {
            title: '多选',
            type: 'Switch',
            value: {
                get({ data }: EditorResult<Data>) {
                    return data.config.multiple;
                },
                set({ data, input, output }: EditorResult<Data>, value: boolean) {
                    data.config.multiple = value;
                    data.config.treeCheckable = value;
                    if (value) {
                        const valueSchema = {
                            type: 'array'
                        };
                        input.get(InputIds.SetValue).setSchema(valueSchema);
                        output.get(OutputIds.OnChange).setSchema(valueSchema);
                        output.get(OutputIds.ReturnValue).setSchema(valueSchema);
                    } else {
                        const valueSchema = {
                            type: 'any'
                        };
                        input.get(InputIds.SetValue).setSchema(valueSchema);
                        output.get(OutputIds.OnChange).setSchema(valueSchema);
                        output.get(OutputIds.ReturnValue).setSchema(valueSchema);
                    }
                }
            }
        },
        {
            title: '节点数配置',
            type: "Select",
            description: '多选结点是自适应还是自定义',
            ifVisible({ data }: EditorResult<Data>) {
                return data.config.multiple;
            },
            options: [
                {
                    label: "自适应",
                    value: "isResponsive"
                },
                {
                    label: "自定义",
                    value: "isCustom"
                }
            ],
            value: {
                get({ data }: EditorResult<Data>) {
                    return data.maxTagCountType;
                },
                set({ data }: EditorResult<Data>, value: 'isResponsive' | 'isCustom') {
                    data.maxTagCountType = value;
                    if (data.maxTagCountType == "isResponsive") {
                        data.config.maxTagCount = 'responsive';
                    }
                }
            }
        },
        {
            title: '输出内容',
            type: 'Select',
            options: [
                { label: '只输出子节点', value: TreeSelect.SHOW_CHILD },
                { label: '只输出父节点', value: TreeSelect.SHOW_PARENT },
                { label: '输出父节点和子节点', value: TreeSelect.SHOW_ALL }
            ],
            ifVisible({ data }: EditorResult<Data>) {
                return data.config.multiple;
            },
            value: {
                get({ data }: EditorResult<Data>) {
                    return data.config.showCheckedStrategy;
                },
                set({ data }: EditorResult<Data>, value: string) {
                    data.config.showCheckedStrategy = value as any;
                }
            }
        },
        {
            title: '最多显示数量',
            type: 'InputNumber',
            description: '当选中个数大于设置值时，会只显示选中数量',
            options: [{ min: 0 }],
            ifVisible({ data }: EditorResult<Data>) {
                return data.config.multiple && data.maxTagCountType === "isCustom";
            },
            value: {
                get({ data }: EditorResult<Data>) {
                    return [data.config.maxTagCount];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                    data.config.maxTagCount = value[0];
                }
            }
        }
    ]
};

export default treeSelectEditors;