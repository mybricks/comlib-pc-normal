import { OutputIds } from '../../constants';
import { getColumnsDataSchema, setCol } from '../../schema';
import { Data } from '../../types';
import { getColumnItem } from '../../utils';

const EditEditor = {
    title: '单元格编辑',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return ['text'].includes(item.contentType);
    },
    items: [
        {
            title: '支持编辑',
            type: 'Switch',
            description: '支持编辑单元格数据',
            value: {
                get({ data, focusArea }: EditorResult<Data>) {
                    if (!focusArea) return;
                    const item = getColumnItem(data, focusArea);
                    return item.supportEdit;
                },
                set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
                    if (!focusArea) return;
                    setCol(data, focusArea, value, 'supportEdit');
                    if (value) {
                        const paramRules = {
                            title: '表格行数据',
                            type: 'object',
                            properties: getColumnsDataSchema(data.columns)
                        };
                        output.add(OutputIds.MODIFY_CELL, '单元格修改', paramRules);
                    } else {
                        output.remove(OutputIds.MODIFY_CELL);
                    }
                }
            }
        },
        {
            title: '编辑完成',
            type: '_Event',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getColumnItem(data, focusArea);
                return item.supportEdit;
            },
            options: () => {
                return {
                    outputId: OutputIds.MODIFY_CELL
                };
            }
        }
    ]
};

export default EditEditor;