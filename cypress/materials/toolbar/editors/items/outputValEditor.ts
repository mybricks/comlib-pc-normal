import { OutputIds } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';
import { message } from 'antd';

const OutputValEditor = [
  {
    title: '触发数据',
    items: [
      {
        title: '类型',
        type: 'Select',
        options: [
          { value: 'null', label: '无' },
          { value: 'number', label: '数字' },
          { value: 'string', label: '字符' },
          { value: 'object', label: '对象' },
          { value: 'boolean', label: '布尔' },
          { value: 'external', label: '外部传入' }
        ],
        value: {
          get({ data, output, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            //单击的事件
            const click = output.get(item.key);
            //双击的事件
            const dbClick = output.get(`${OutputIds.DoubleClick}_${item.key}`);
            // if(item.dataType === 'number'){
            //   click.setSchema({
            //     type: 'number'
            //   });
            //   dbClick.setSchema({
            //     type: 'number'
            //   });
            // }
            return item.dataType || 'number';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external') {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            //单击的事件
            const click = output.get(item.key);
            //双击的事件
            const dbClick = output.get(`${OutputIds.DoubleClick}_${item.key}`);
            click.setSchema({
              type: 'any'
            });
            dbClick.setSchema({
              type: 'any'
            });
            if (value === 'number') {
              click.setSchema({
                type: 'number'
              });
              dbClick.setSchema({
                type: 'number'
              });
              item.outVal = 0;
            } else if (value === 'string') {
              click.setSchema({
                type: 'string'
              });
              dbClick.setSchema({
                type: 'string'
              });
              item.outVal = '';
            } else if (value === 'object') {
              click.setSchema({
                type: 'object',
                properties: {}
              });
              dbClick.setSchema({
                type: 'object',
                properties: {}
              });
              item.outVal = {};
            } else if (value === 'boolean') {
              click.setSchema({
                type: 'boolean'
              });
              dbClick.setSchema({
                type: 'boolean'
              });
              item.outVal = false;
            } else {
              item.outVal = null;
            }
            if (value === 'external') {
              const { item } = getBtnItemInfo(data, focusArea);
              click.setSchema({
                type: 'follow'
              });
              dbClick.setSchema({
                type: 'follow'
              });
              input.add(item.key, `设置${item.text}输出数据`, {
                type: 'follow'
              });
            } else {
              if (input.get(item.key)) {
                input.remove('external');
              }
            }
            item.dataType = value;
          }
        }
      },
      {
        title: '输出值',
        type: 'Text',
        options: {
          type: 'number'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { item } = getBtnItemInfo(data, focusArea);
          return item.dataType === 'number';
        },
        description: '点击按钮向外输出的值，只可输入数字',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { item } = getBtnItemInfo(data, focusArea);
            return item.outVal || 0;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { item } = getBtnItemInfo(data, focusArea);
            item.outVal = Number(value) || 0;
          }
        }
      },
      {
        title: '输出值',
        type: 'Text',
        ifVisible({ data, focusArea }) {
          const { item } = getBtnItemInfo(data, focusArea);
          return item.dataType === 'string';
        },
        description: '点击按钮向外输出的值，可以为任意字符',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { item } = getBtnItemInfo(data, focusArea);
            return item.outVal;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { item } = getBtnItemInfo(data, focusArea);
            item.outVal = value;
          }
        }
      },
      {
        title: '输出值',
        type: 'Switch',
        ifVisible({ data, focusArea }) {
          const { item } = getBtnItemInfo(data, focusArea);
          return item.dataType === 'boolean';
        },
        description: '点击按钮向外输出的值, 打开输出true, 关闭输出false',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { item } = getBtnItemInfo(data, focusArea);
            return item.outVal;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { item } = getBtnItemInfo(data, focusArea);
            item.outVal = value;
          }
        }
      },
      {
        title: '输出值',
        type: 'TextArea',
        ifVisible({ data, focusArea }) {
          const { item } = getBtnItemInfo(data, focusArea);
          return item.dataType === 'object';
        },
        description:
          '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { item } = getBtnItemInfo(data, focusArea);
            try {
              return (
                JSON.stringify(item.outVal) || '{}'
              );
            } catch {
              return '{}';
            }
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            try {
              const resValue = JSON.parse(
                value.replace(/\n/g, '').replace(/\r/g, '')
              );
              const { item } = getBtnItemInfo(data, focusArea);
              item.outVal = resValue;
            } catch {
              message.warning('输出值格式有误, 参考格式{"name": "poweros"}');
            }
          }
        }
      }
    ]
  }
];

export default OutputValEditor;