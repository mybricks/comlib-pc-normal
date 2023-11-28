import React from 'react';
import visibleOpt from '../../../components/editorRender/visibleOpt';
import { setDataSchema } from '../../schema';
import { ContentTypeEnum, Data, IColumn, TableLayoutEnum, WidthTypeEnum } from '../../types';
import { getNewColumn, setColumns } from '../../utils';
import { message } from 'antd';

const ColorMap = {
  number: {
    color: '#4460B8',
    text: '数字'
  },
  boolean: {
    color: '#ff0000',
    text: '布尔'
  },
  string: {
    color: '#88a409',
    text: '字符'
  },
  object: {
    color: '#9727d0',
    text: '对象'
  },
  array: {
    color: '#ce980f',
    text: '数组'
  }
};

const getAddColumnEditor = ({ data, env }: EditorResult<Data>) => {
  return {
    title: '列',
    items: [
      {
        title: '显示列头',
        type: 'switch',
        description: '关闭后，不显示列标题行',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showHeader === false ? false : true;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showHeader = value;
          }
        }
      },
      {
        title: '列宽分配',
        type: 'Select',
        options: [
          { label: '固定列宽(不自动适配)', value: TableLayoutEnum.FixedWidth },
          { label: '按比例分配多余宽度', value: TableLayoutEnum.Fixed },
          { label: '按比例适配（无横向滚动条）', value: TableLayoutEnum.Auto }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.tableLayout || TableLayoutEnum.Fixed;
          },
          set({ data }: EditorResult<Data>, value: TableLayoutEnum) {
            data.tableLayout = value;
          }
        }
      },
      {
        title: '',
        type: 'array',
        options: {
          addText: '添加列',
          editable: true,
          customOptRender: visibleOpt,
          getTitle: (item: IColumn) => {
            const path = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
            const { color, text } = ColorMap[item.dataSchema?.type] || ColorMap.string;
            if (item.visible) {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    【{item.width === WidthTypeEnum.Auto ? '自适应' : `${item.width}px`}】
                    {env.i18n(item.title)}
                    {path ? `(${path})` : ''}
                  </span>
                </>
              );
            } else {
              return (
                <>
                  <span style={{ color }}>{text}</span>
                  <span>
                    【隐藏】{env.i18n(item.title)}({path})
                  </span>
                </>
              );
            }
          },
          onAdd: () => {
            return getNewColumn(data);
          },
          items: [
            {
              title: '列名',
              type: 'Text',
              options: {
                locale: true
              },
              value: 'title'
            },
            {
              title: '字段',
              type: 'Text',
              value: 'dataIndex',
              options: {
                placeholder: '不填默认使用 列名 作为字段'
              }
            },
            {
              title: '适应剩余宽度',
              type: 'switch',
              // 添加额外字段用来标记是否自动
              value: 'isAutoWidth',
              ifVisible(item) {
                return item.contentType !== ContentTypeEnum.Group;
              },
              options: {
                type: 'number'
              }
            },
            {
              title: '宽度',
              type: 'Text',
              value: 'width',
              ifVisible(item) {
                return (
                  item.contentType !== ContentTypeEnum.Group && item.width !== WidthTypeEnum.Auto
                );
              },
              options: {
                type: 'number'
              }
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [
              ...data.columns.map((item) => ({
                ...item,
                isAutoWidth: item.width === WidthTypeEnum.Auto
              }))
            ];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: IColumn[]) {
            for (let item of val) {
              if (item.dataIndex === '') {
                item.dataIndex = item.title;
                message.warn(`字段不能为空！`);
              }
            }
            const cols = val.map((item) => ({
              ...item,
              width: item.isAutoWidth
                ? WidthTypeEnum.Auto
                : item.width === WidthTypeEnum.Auto
                ? 140
                : Number(item.width),
              isAutoWidth: undefined
            }));
            setColumns({ data, slot }, cols);
            setDataSchema({ data, output, input, slot, ...res });
          }
        }
      }
    ]
  };
};

export default getAddColumnEditor;
