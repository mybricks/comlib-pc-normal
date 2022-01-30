import { uuid } from '../../../utils';
import { getActionSchema, setCol, setDataSchema } from '../../schema';
import { Data } from '../../types';
import { setLinkColAction } from './item/link';

function removeActionBtns(actionBtns, output) {
  actionBtns.forEach((item) => {
    output.remove(item.id);
  });
}

function addActionBtnsOutput(data: Data, actionBtns: any[], output: any) {
  const paramRules = getActionSchema(data);

  actionBtns.forEach((item) => {
    output.add(item.id, item.title, paramRules);
  });
}

const BaseEditor = {
  title: '基础配置',
  items: [
    {
      title: '列名',
      type: 'Text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && item.title;
        },
        set(
          { data, focusArea, output, input }: EditorResult<Data>,
          value: string
        ) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'title');
          setDataSchema({ data, output, input });
          setLinkColAction({ data, focusArea, output });
        }
      }
    },
    {
      title: '字段',
      type: 'Text',
      description: '与后端返回数据字段对应',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          const ret = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
          return ret;
        },
        set(
          { data, focusArea, output, input }: EditorResult<Data>,
          value: string
        ) {
          if (!focusArea || focusArea.dataset.tableThIdx < 0) return;
          let valArr: string | string[] = value.trim().split('.');
          if (valArr.length === 1) valArr = valArr[0];
          setCol(data, focusArea, valArr, 'dataIndex');
          setCol(data, focusArea, value, 'key');
          setDataSchema({ data, output, input });
        }
      }
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '普通文字', value: 'text' },
        { label: '彩色文字', value: 'color' },
        // { label: '输入框', value: 'input' },
        { label: '状态点', value: 'badge' },
        { label: '链接', value: 'link' },
        { label: '标签', value: 'tag' },
        { label: '按钮组', value: 'action' },
        { label: '图片', value: 'image' },
        { label: '自定义插槽', value: 'slotItem' },
        // { label: '自定义渲染', value: 'custom' }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return data.columns[focusArea.dataset.tableThIdx].contentType;
        },
        set(
          { data, focusArea, output, input, slot }: EditorResult<Data>,
          value
        ) {
          if (!focusArea) return;
          const column = data.columns[focusArea.dataset.tableThIdx];

          if (value === 'action') {
            column.title = '操作';
            column.actionBtns = column.actionBtns ? column.actionBtns : [];

            if (column.sorter?.enable) {
              column.sorter.enable = false;
            }

            if (column.actionBtns.length > 0) {
              addActionBtnsOutput(data, column.actionBtns, output);
            } else {
              const id = uuid();
              const title = `按钮${column.actionBtns?.length}`;
              const paramRules = getActionSchema(data);
              column.actionBtns?.push({
                id,
                title,
                size: 'small',
                type: 'ghost',
                showText: true
              });
              output.add(id, title, paramRules);
              column.ellipsisActionBtnsConfig = {
                maxToEllipsis: 3,
                trigger: ['click']
              };
            }
          } else {
            const actionBtns = column.actionBtns;
            if (actionBtns && actionBtns.length !== 0) {
              removeActionBtns(actionBtns, output);
            }
          }

          // if (value === 'custom') {
          //   if (column.sorter?.enable) {
          //     column.sorter.type = 'request';
          //   }
          // }

          if (value === 'slotItem') {
            const slotId = uuid();
            column['slotId'] = slotId;
            slot.add(slotId, '自定义内容', { schema: 'parent-schema' });
            const outputId = uuid();
            column.slotConfig = Object.assign(column.slotConfig || {}, {
              outputId
            });
            output.add(outputId, `${column.dataIndex} 自定义插槽内容刷新`, {
              title: '输出',
              type: 'any'
            });
          } else {
            if (slot.get(column.slotId)) {
              slot.remove(column.slotId);
              column.slotId = '';
            }
            if (column.slotConfig?.outputId) {
              output.remove(column.slotConfig.outputId);
              column.slotConfig.outputId = undefined;
            }
          }

          column.contentType = value;
          setDataSchema({ data, input, output });
          setLinkColAction({ data, focusArea, output });
        }
      }
    }
  ]
};

export default BaseEditor;
