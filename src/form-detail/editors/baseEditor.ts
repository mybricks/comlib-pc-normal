import { uuid } from '../../utils';
import { Data, DataSourceEnum, InputIds, TypeEnum } from '../constants';
import { Schemas, updateIOSchema } from './utils';

export const BaseEditor = [
  {
    title: '增加字段',
    type: 'Button',
    value: {
      set({ data, input, output }: EditorResult<Data>) {
        const id = uuid();
        data.items.push({
          id: id,
          label: `新增字段`,
          key: id,
          value: ``,
          span: 1,
          labelStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            lineHeight: 1,
            color: '#8c8c8c',
            letterSpacing: 0
          },
          contentStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            lineHeight: 1,
            color: '#333333',
            letterSpacing: 0
          },
          type: TypeEnum.Text,
          direction: 'horizontal',
          useSuffix: false,
          suffixBtnText: '查看更多'
        });
        updateIOSchema({ data, input, output });
      }
    }
  },
  {
    title: '数据来源',
    type: 'Select',
    options: [
      { label: '手动搭建', value: DataSourceEnum.Default },
      { label: '动态获取', value: DataSourceEnum.External }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.dataSource;
      },
      set({ data, input }: EditorResult<Data>, value: DataSourceEnum) {
        data.dataSource = value;
        const hasEvent = input.get(InputIds.SetDataSource);
        if (value === DataSourceEnum.External) {
          data.items.forEach((item) => {
            item.value = '';
          });
          !hasEvent &&
            input.add(
              InputIds.SetDataSource,
              '数据输入',
              Schemas.SetDataSource(data)
            );
        } else {
          hasEvent && input.remove(InputIds.SetDataSource);
        }
      }
    }
  },
  {
    title: '显示冒号',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.colon;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.colon = value;
      }
    }
  },
  {
    title: '显示标题',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        data.showTitle = value;
        const hasEvent = input.get(InputIds.SetTitle);
        if (value)
          data.dynamicTitle &&
            !hasEvent &&
            input.add(
              InputIds.SetTitle,
              '设置标题',
              { type: 'string' }
            )
        else
          hasEvent && input.remove(InputIds.SetTitle);
      }
    }
  },
  {
    title: '标题配置',
    ifVisible({ data }: EditorResult<Data>) {
      return data.showTitle;
    },
    items: [
      {
        title: '动态获取',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.dynamicTitle;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            data.dynamicTitle = value;
            const hasEvent = input.get(InputIds.SetTitle);
            if (value) {
              !hasEvent && input.add(
                InputIds.SetTitle,
                '设置标题',
                { type: 'string' }
              );
              data.title = '动态标题';
            } else {
              hasEvent && input.remove(InputIds.SetTitle);
              data.title = '请设置标题';
            }
          }
        }
      },
      {
        type: 'Text',
        title: '文本',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.dynamicTitle;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.title = value;
          }
        }
      }
    ]
  }
];
