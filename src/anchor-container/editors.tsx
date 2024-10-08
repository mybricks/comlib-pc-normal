import { AnchorPosition, Data, InputIds, Option } from './constants';

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
  '@resize': {
    options: ['width']
  },
  ':root': ({ data, slots }: EditorResult<Data>, cate1) => {
    cate1.title = '高级';
    cate1.items = [
      {
        title: '动态设置数据源',
        description: '开启后，数据源将通过输入输出连接以列表的形式批量进行动态设置',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicData;
          },
          set({ data, inputs, outputs }: EditorResult<Data>, value: boolean) {
            if (value) {
              inputs.add({
                id: 'dataSource',
                title: '设置数据源',
                desc: '设置列表容器数据源，数据结构要求是数组',
                schema: {
                  title: '列表数据',
                  type: 'array',
                  items: {
                    title: '列项数据',
                    type: 'any'
                  }
                }
              });
              outputs.add({
                id: 'setDataSourceDone',
                title: '设置数据源完成',
                schema: {
                  title: '列表数据',
                  type: 'array',
                  items: {
                    title: '列项数据',
                    type: 'any'
                  }
                }
              });
              inputs.get('dataSource').setRels(['setDataSourceDone']);
            } else {
              inputs.remove('dataSource');
              outputs.remove('setDataSourceDone');
            }
            data.useDynamicData = value;
          }
        }
      },
      {
        title: '静态选项配置',
        type: 'array',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useDynamicData;
        },
        options: {
          getTitle: ({ title }) => {
            return `${title}`;
          },
          onAdd: (_id: string) => {
            const defaultOption = {
              id: _id,
              title: `锚点${data.staticData.length + 1}`
            };
            slots.add(defaultOption);
            return defaultOption;
          },
          onRemove: (_id: string) => {
            slots.remove(_id);
          },
          items: [
            {
              title: '标题',
              type: 'text',
              options: {
                locale: true
              },
              value: 'title'
            }
          ]
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return data.staticData;
          },
          set({ data, focusArea, env }: EditorResult<Data>, options: Option[]) {
            data.staticData = options;
            options.forEach((item) => {
              slots.get(item.id).setTitle(`${env.i18n(item.title)}目标`);
            });
          }
        }
      },
      {
        title: '固定显示锚点链接',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.enableFix;
          },
          set({ data, input, output }: EditorResult<Data>, val: boolean) {
            data.enableFix = val;
          }
        }
      },
      {
        title: '隐藏锚点选项',
        type: 'Switch',
        description: '开启后，可以通过，设置激活的锚点，进行跳转',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.hideAnchorList;
          },
          set({ data, input, output }: EditorResult<Data>, val: boolean) {
            data.hideAnchorList = val;
            const event1 = input.get('setActiveAnchor');
            if (val) {
              if (!event1) {
                input.add('setActiveAnchor', `设置激活锚点`, {
                  type: 'object',
                  properties: {
                    index: {
                      title: '锚点索引',
                      type: 'number',
                      description: '激活锚点的索引，从0开始'
                    },
                    title: {
                      title: '锚点标题',
                      type: 'string',
                      description: '锚点标题内容'
                    }
                  }
                });
                output.add(`${'setActiveAnchor'}Done`, '完成', {
                  type: 'object',
                  properties: {
                    index: {
                      title: '锚点索引',
                      type: 'number',
                      description: '激活锚点的索引，从0开始'
                    },
                    title: {
                      title: '锚点标题',
                      type: 'string',
                      description: '锚点标题内容'
                    }
                  }
                });
                input.get('setActiveAnchor').setRels([`${'setActiveAnchor'}Done`]);
              }
            } else {
              if (event1) {
                input.remove('setActiveAnchor');
                output.remove(`${'setActiveAnchor'}Done`);
              }
            }
          }
        }
      },
      {
        title: '锚点链接位置',
        type: 'radio',
        options: [
          {
            label: '左',
            value: 'left'
          },
          {
            label: '右',
            value: 'right'
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.anchorPosition;
          },
          set({ data }: EditorResult<Data>, val: AnchorPosition) {
            data.anchorPosition = val;
          }
        }
      }
      //   {
      //     title: 'loading',
      //     type: 'Switch',
      //     value: {
      //       get({ data }: EditorResult<Data>) {
      //         return data.useLoading;
      //       },
      //       set({ data, input, output }: EditorResult<Data>, val: boolean) {
      //         data.useLoading = val;
      //         if (val) {
      //           !input.get(InputIds.LOADING) &&
      //             input.add(InputIds.LOADING, '设置loading', { type: 'boolean' });
      //           !output.get('setLoadingDone') &&
      //             output.add('setLoadingDone', '设置loading完成', { type: 'boolean' });
      //           input.get(InputIds.LOADING).setRels(['setLoadingDone']);
      //         } else {
      //           input.get(InputIds.LOADING) && input.remove(InputIds.LOADING);
      //           output.get('setLoadingDone') && output.remove('setLoadingDone');
      //         }
      //       }
      //     }
      //   },
      //   {
      //     title: '加载中文案',
      //     type: 'text',
      //     ifVisible({ data }: EditorResult<Data>) {
      //       return data.useLoading;
      //     },
      //     value: {
      //       get({ data }: EditorResult<Data>) {
      //         return data.loadingTip;
      //       },
      //       set({ data }: EditorResult<Data>, val: string) {
      //         data.loadingTip = val;
      //       }
      //     }
      //   }
    ];
  }
};
