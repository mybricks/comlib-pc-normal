import React from 'react';
import visibleOpt from '../../../components/editorRender/visibleOpt';
import { getTableSchema, setDataSchema } from '../../schema';
import { ContentTypeEnum, Data, IColumn, TableLayoutEnum, WidthTypeEnum } from '../../types';
import { getNewColumn, setColumns } from '../../utils';
import { message } from 'antd';
import { DefaultRowKeyKey, ColorMap } from '../../constants';
import RowKeyEditor from '../table/rowKey';

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
        description: '手动添加表格列',
        options: {
          addText: '添加列',
          editable: true,
          customOptRender: visibleOpt,
          handleDelete: (item: IColumn) => item.key === DefaultRowKeyKey,
          tagsRender: (item: IColumn) =>
            item.key === DefaultRowKeyKey ? [{ color: '#fa6400', text: '唯一Key' }] : [],
          getTitle: (item: IColumn) => {
            const path = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
            const { color, text } = ColorMap[item.dataSchema?.type] || ColorMap.string;
            // 唯一列title
            if (item.key === DefaultRowKeyKey) {
              return `${item.dataIndex}`;
            }
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
              type: 'TextArea',
              ifVisible(item: IColumn) {
                return item.key !== DefaultRowKeyKey;
              },
              options: {
                locale: true,
                autoSize: { minRows: 2, maxRows: 2 }
              },
              value: 'title'
            },
            {
              title: '字段',
              type: 'Text',
              value: 'dataIndex',
              ifVisible(item: IColumn) {
                return item.key !== DefaultRowKeyKey;
              },
              options: {
                placeholder: '不填默认使用 列名 作为字段'
              }
            },
            {
              title: '适应剩余宽度',
              type: 'switch',
              // 添加额外字段用来标记是否自动
              value: 'isAutoWidth',
              ifVisible(item: IColumn) {
                return item.contentType !== ContentTypeEnum.Group && item.key !== DefaultRowKeyKey;
              },
              options: {
                type: 'number'
              }
            },
            {
              title: '宽度',
              type: 'Text',
              value: 'width',
              ifVisible(item: IColumn) {
                return (
                  item.contentType !== ContentTypeEnum.Group &&
                  item.width !== WidthTypeEnum.Auto &&
                  item.key !== DefaultRowKeyKey
                );
              },
              options: {
                type: 'number'
              }
            },
            {
              ...RowKeyEditor[0],
              value: 'rowKeyEditor'
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [
              ...data.columns.map((item) => ({
                ...item,
                isAutoWidth: item.width === WidthTypeEnum.Auto,
                rowKeyEditor:
                  item.key === DefaultRowKeyKey
                    ? {
                        value: data.rowKey || 'id',
                        schema: {
                          type: 'object',
                          properties: getTableSchema({ data }) || {}
                        },
                        placeholder: '默认使用随机生成的内置标识'
                      }
                    : void 0
              }))
            ];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: IColumn[]) {
            for (let item of val) {
              if (item.dataIndex === '') {
                item.dataIndex = item.title;
                message.warn(`表格列字段不能为空！`);
              }

              if (item.key === DefaultRowKeyKey && item?.rowKeyEditor) {
                const rowKeyEditor = item.rowKeyEditor;
                const value = typeof rowKeyEditor === 'object' ? rowKeyEditor.value : rowKeyEditor;
                data.rowKey = String(value || 'id');
                item.dataIndex = data.rowKey;
              }
            }
            const cols = val.map((item) => ({
              ...item,
              // width: item.isAutoWidth
              //   ? WidthTypeEnum.Auto
              //   : item.width === WidthTypeEnum.Auto
              //     ? 'auto'
              //     : Number(item.width),
              width: item.isAutoWidth ? WidthTypeEnum.Auto : Number(item.width) || 140,
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
