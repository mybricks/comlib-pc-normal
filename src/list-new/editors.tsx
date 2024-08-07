import { Data, InputIds, OutputIds } from './constants';
import { LayoutEditor } from './editor/layoutEditor';

export default {
  ':slot': {},
  '@inputConnected'({ data, input, output, slots }, fromPin, toPin) {
    if (toPin.id === InputIds.DATA_SOURCE) {
      let itemSchema = {};
      if (fromPin.schema.type === 'array') {
        itemSchema = fromPin.schema.items;
        input.get('dataSource').setSchema(fromPin.schema);
        slots.get('item').inputs.get('itemData').setSchema(itemSchema);
      }
    }
  },
  '@init': ({ style }) => {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {
        title: '容器',
        options: [
          'border',
          'padding',
          { type: 'background', config: { disableBackgroundImage: true } },
          'BoxShadow'
        ],
        target: '> .list-new__root'
      },
      {
        title: '列表项（运行时生效）',
        options: [
          'border',
          'padding',
          { type: 'background', config: { disableBackgroundImage: true } },
          'BoxShadow'
        ],
        target: '.list-new__item'
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '布局';
      cate1.items = [...LayoutEditor];
      cate2.title = '高级';
      cate2.items = [
        {
          title: '获取列表数据',
          type: 'Switch',
          description:
            '开启后，可以通过逻辑连线连接列表容器的输入项【获取列表数据】，对应关联输出项【数据输出】会输出列表数据',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useGetDataSource;
            },
            set({ data, input, output }: EditorResult<Data>, val: boolean) {
              data.useGetDataSource = val;
              const hasInputEvent = input.get(InputIds.GetDataSource);
              const hasOutputEvent = output.get(OutputIds.GetDataSource);
              if (val) {
                !hasInputEvent &&
                  input.add(InputIds.GetDataSource, '获取列表数据', { type: 'any' });
                !hasOutputEvent &&
                  output.add(OutputIds.GetDataSource, '数据输出', {
                    type: 'array',
                    items: {
                      title: '列项数据',
                      type: 'object',
                      properties: {}
                    }
                  });
                input.get(InputIds.GetDataSource).setRels([OutputIds.GetDataSource]);
              } else {
                hasInputEvent && input.remove(InputIds.GetDataSource);
                hasOutputEvent && output.remove(OutputIds.GetDataSource);
              }
            }
          }
        },
        {
          title: 'loading',
          type: 'Switch',
          description:
            '开启后，可以通过逻辑连线连接列表容器的输入项【设置loading】，控制列表容器的loading状态',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useLoading;
            },
            set({ data, input, output }: EditorResult<Data>, val: boolean) {
              data.useLoading = val;
              if (val) {
                !input.get(InputIds.LOADING) &&
                  input.add(InputIds.LOADING, '设置loading', { type: 'boolean' });
                !output.get('setLoadingDone') &&
                  output.add('setLoadingDone', '设置loading完成', { type: 'boolean' });
                input.get(InputIds.LOADING).setRels(['setLoadingDone']);
              } else {
                input.get(InputIds.LOADING) && input.remove(InputIds.LOADING);
                output.get('setLoadingDone') && output.remove('setLoadingDone');
              }
            }
          }
        },
        {
          title: '加载中文案',
          type: 'text',
          description: '加载中文案',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useLoading;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.loadingTip;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.loadingTip = val;
            }
          }
        },
        {
          title: '列表项数据唯一标识',
          type: 'text',
          description: '可不填，填写之后作为列表项数据的唯一标识',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.rowKey;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.rowKey = val;
            }
          }
        },
        {
          title: '拖拽完成',
          description: '拖拽完成事件',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return data.canSort;
          },
          options: {
            outputId: OutputIds.SortComplete
          }
        }
      ];
    }
  }
};
