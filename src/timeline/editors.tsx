import { uuid } from '../utils';
import {
  Data,
  DATA_SOURCE_TYPE,
  InputIds,
  OutputIds,
  Schemas
} from './constants';

const addItem = (data: Data) => {
  const id = uuid();
  const title = '时间轴';
  const defaultItem = {
    id,
    title
  };
  data.timelines.push(defaultItem);
};

const ITEM_ID = 'timelineId';

const getTimeline = ({
  data,
  focusArea,
  dataset = ITEM_ID,
  val = 'obj',
  cb
}: {
  data: Data;
  focusArea: any;
  dataset?: string;
  val?: string;
  cb?: any;
}) => {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  const index = data.timelines.findIndex((def) => def.id === key);
  if (index === -1) return;
  if (cb) cb(index);
  if (val === 'obj') {
    return data.timelines[index];
  }
  return data.timelines[index][val];
};

const moveDelete = (dataset: string) => {
  return [
    {
      title: '上移',
      type: 'Button',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        let bool = false;
        getTimeline({
          data,
          focusArea,
          dataset,
          val: 'obj',
          cb: (index) => {
            if (data.timelines.length > 1 && index !== 0) {
              bool = true;
            }
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: EditorResult<Data>) {
          getTimeline({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              const tool = data.timelines[index];
              data.timelines.splice(index, 1);
              data.timelines.splice(index - 1, 0, tool);
            }
          });
        }
      }
    },
    {
      title: '下移',
      type: 'Button',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        let bool = false;
        getTimeline({
          data,
          focusArea,
          dataset,
          val: 'obj',
          cb: (index) => {
            if (
              data.timelines.length > 1 &&
              index !== data.timelines.length - 1
            ) {
              bool = true;
            }
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: EditorResult<Data>) {
          getTimeline({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              const tool = data.timelines[index];
              data.timelines.splice(index, 1);
              data.timelines.splice(index + 1, 0, tool);
            }
          });
        }
      }
    },
    {
      title: '删除',
      type: 'Button',
      value: {
        set({ data, focusArea, output }: EditorResult<Data>) {
          getTimeline({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              output.remove(data.timelines[index].id);
              data.timelines.splice(index, 1);
            }
          });
        }
      }
    }
  ];
};

export default {
  '@init': ({ data }: EditorResult<Data>) => {
    if (data.timelines.length === 0) {
      addItem(data);
    }
  },
  ':root': ({ }, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '数据来源',
        type: 'Select',
        options: [
          {
            label: '手动搭建',
            value: DATA_SOURCE_TYPE.STATIC
          },
          {
            label: '动态获取',
            value: DATA_SOURCE_TYPE.DYNAMIC
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.dataSource;
          },
          set({ data, input }: EditorResult<Data>, value: DATA_SOURCE_TYPE) {
            data.dataSource = value;
            if (value === DATA_SOURCE_TYPE.DYNAMIC) {
              data.timelines.forEach((item) => {
                item.title = '标题';
                item.subTitle = '子标题';
                item.description = '';
              });
              input.add(
                InputIds.SetDataSource,
                '接收数据',
                Schemas[InputIds.SetDataSource]
              );
            } else {
              input.remove(InputIds.SetDataSource);
            }
          }
        }
      },
      {
        title: '添加时间轴节点',
        type: 'Button',
        value: {
          set({ data }: EditorResult<Data>) {
            addItem(data);
          }
        }
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '内容位置',
        type: 'Select',
        options: [
          {
            label: '左侧展现',
            value: 'left'
          },
          {
            label: '交替展现',
            value: 'alternate'
          },
          {
            label: '右侧展现',
            value: 'right'
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.mode;
          },
          set(
            { data }: EditorResult<Data>,
            value: 'left' | 'right' | 'alternate'
          ) {
            data.mode = value;
          }
        }
      },
      {
        title: '排序方式',
        type: 'Select',
        options: [
          { label: '正序', value: false },
          { label: '倒序', value: true }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.reverse;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.reverse = value;
          }
        }
      },
      {
        title: '宽度',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.width;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.width = value;
          }
        }
      },
      {
        title: '支持展开收起',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.supportCollapse;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.supportCollapse = value;
          }
        }
      }
    ];

    cate3.title = '事件';
    cate3.items = [
      {
        title: '点击',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useItemClick;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.ItemClick);
            if (value) {
              !hasEvent &&
                output.add(OutputIds.ItemClick, '点击', { type: 'any' });
            } else {
              hasEvent && output.remove(OutputIds.ItemClick);
            }
            data.useItemClick = value;
          }
        }
      },
      {
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useItemClick;
        },
        options: {
          outputId: OutputIds.ItemClick
        }
      }
    ];

    return { title: '时间轴' };
  },
  '[data-timeline-id]': {
    title: '时间轴节点',
    items: [
      {
        title: '标题',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return data.dataSource === DATA_SOURCE_TYPE.STATIC;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getTimeline({ data, focusArea, val: 'title' });
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = getTimeline({ data, focusArea });
            res.title = value;
          }
        }
      },
      {
        title: '副标题',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return data.dataSource === DATA_SOURCE_TYPE.STATIC;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getTimeline({ data, focusArea, val: 'subTitle' });
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = getTimeline({ data, focusArea });
            res.subTitle = value;
          }
        }
      },
      {
        title: '描述',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return data.dataSource === DATA_SOURCE_TYPE.STATIC;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getTimeline({ data, focusArea, val: 'description' });
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = getTimeline({ data, focusArea });
            res.description = value;
          }
        }
      },
      {
        title: '圆框样式',
        type: 'style',
        options: ['BGCOLOR'],
        value: {
          get({ data }) {
            return { background: data.color };
          },
          set(
            { data, focusArea }: EditorResult<Data>,
            theme: { background: string }
          ) {
            const res = getTimeline({ data, focusArea });
            res.color = theme.background;
          }
        }
      },
      ...moveDelete(ITEM_ID)
    ]
  }
};
