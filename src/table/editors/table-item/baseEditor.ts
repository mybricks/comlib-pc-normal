import Tree from '../../../components/editorRender/fieldSelect';
import { uuid } from '../../../utils';
import { InputIds } from '../../constants';
import { ContentTypeEnum, Data } from '../../types';
import { getDefaultDataSchema, Schemas, setCol, setDataSchema } from '../../schema';
import { getColumnItem, getColumnsSchema } from '../../utils';

const BaseEditor = {
  title: '基础配置',
  items: [
    {
      title: '列名',
      type: 'Text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item && item.title;
        },
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'title', value);
          setDataSchema({ data, focusArea, output, input, ...res });
        }
      }
    },
    {
      title: '保留字段',
      type: 'Switch',
      description: '开启后，可编辑当前列字段和传递列数据',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return [ContentTypeEnum.SlotItem].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.keepDataIndex;
        },
        set({ data, focusArea, output, input, slot, ...res }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          const hasEvent = slot.get(item.slotId).inputs.get(InputIds.SLOT_ROW_VALUE);
          if (value) {
            !hasEvent && [ContentTypeEnum.SlotItem].includes(item.contentType);
            slot.get(item.slotId).inputs.add(InputIds.SLOT_ROW_VALUE, '当前列数据', Schemas.Any);
          } else {
            hasEvent && slot.get(item.slotId).inputs.remove(InputIds.SLOT_ROW_VALUE);
          }
          setCol({ data, focusArea }, 'keepDataIndex', value);
          setDataSchema({ data, focusArea, output, input, slot, ...res });
        }
      }
    },
    {
      title: '字段',
      type: 'editorRender',
      description: '与后端返回数据字段对应，不填默认使用 列名 作为字段',
      options: {
        render: Tree
      },
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return ![ContentTypeEnum.Group].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          const ret = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
          return {
            value: ret,
            schema: getColumnsSchema(data),
            placeholder: '不填默认使用 列名 作为字段',
            disabled: item.contentType === ContentTypeEnum.SlotItem && !item.keepDataIndex
          };
        },
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          let valArr: string | string[] = value.trim().split('.');
          if (valArr.length === 1) {
            valArr = valArr[0];
          }
          if (!`${valArr}`.startsWith('u_') && !item.keepDataIndex) {
            setCol({ data, focusArea }, 'keepDataIndex', true);
          }
          if (data?.domainData?.entity && valArr) {
            // 在领域模型容器，选择字段自动修改列标题
            //@ts-ignore
            setCol({ data, focusArea }, 'title', valArr);
          }
          setCol({ data, focusArea }, 'dataIndex', valArr);
          setDataSchema({ data, focusArea, output, input, ...res });
        }
      }
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '普通文字', value: ContentTypeEnum.Text },
        { label: '自定义插槽', value: ContentTypeEnum.SlotItem },
        { label: '分组', value: ContentTypeEnum.Group }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getColumnItem(data, focusArea).contentType;
        },
        set(
          { data, focusArea, output, input, slot, ...res }: EditorResult<Data>,
          value: ContentTypeEnum
        ) {
          if (!focusArea) return;
          const column = getColumnItem(data, focusArea);
          if (value === ContentTypeEnum.Group) {
            column.children = column.children || [];
          }

          if (value === ContentTypeEnum.SlotItem) {
            const slotId = uuid();
            column['slotId'] = slotId;
            slot.add({ id: slotId, title: `自定义${column.title}列`, type: 'scope' });
            if (column.keepDataIndex) {
              slot.get(slotId).inputs.add(InputIds.SLOT_ROW_VALUE, '当前列数据', Schemas.Any);
            }
            slot.get(slotId).inputs.add(InputIds.SLOT_ROW_RECORD, '当前行数据', Schemas.Object);
            slot.get(slotId).inputs.add(InputIds.INDEX, '当前行序号', Schemas.Number);
          } else {
            if (slot.get(column.slotId)) {
              slot.remove(column.slotId);
              column.slotId = '';
            }
          }
          setCol({ data, focusArea }, 'contentType', value);
          setDataSchema({ data, focusArea, output, input, slot, ...res });
        }
      }
    },
    {
      title: '列数据类型',
      type: '_schema',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return (
          [ContentTypeEnum.Text].includes(item.contentType) ||
          ([ContentTypeEnum.SlotItem].includes(item.contentType) && item.keepDataIndex)
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.dataSchema || getDefaultDataSchema(item.dataIndex, data);
        },
        set({ data, focusArea, ...res }: EditorResult<Data>, value: object) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'dataSchema', value);
          setDataSchema({ data, focusArea, ...res });
        }
      }
    }
  ]
};

export default BaseEditor;
