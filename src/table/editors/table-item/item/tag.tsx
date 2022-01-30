import { Data } from '../../../types';

const setEllipsisConfig = (
  data: Data,
  focusArea: any,
  value: any,
  propName: string
) => {
  const index = +focusArea.dataset.tableThIdx;
  const item = data.columns[index];
  if (!item.ellipsisTagConfig) {
    item.ellipsisTagConfig = {};
  }
  item.ellipsisTagConfig[propName] = value;
};
const getEllipsisConfig = (data: Data, focusArea: any, propName: string) => {
  const index = +focusArea.dataset.tableThIdx;
  const item = data.columns[index];
  if (!item.ellipsisTagConfig) {
    item.ellipsisTagConfig = {
      trigger: 'hover'
    };
  }
  return item.ellipsisTagConfig[propName];
};

const TagItemEditor = {
  title: '标签列设置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = data.columns[focusArea.dataset.tableThIdx];
    return item.contentType === 'tag';
  },
  items: [
    {
      title: '开启省略',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item.contentType === 'tag';
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getEllipsisConfig(data, focusArea, 'useEllipsis');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setEllipsisConfig(data, focusArea, value, 'useEllipsis');
        }
      }
    },
    {
      title: '标签数量超过时省略',
      type: 'Slider',
      options: {
        formatter: '个'
      },
      description: '标签数量超过设置值时显示省略样式',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return (
          item.contentType === 'tag' &&
          getEllipsisConfig(data, focusArea, 'useEllipsis')
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getEllipsisConfig(data, focusArea, 'maxToEllipsis');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setEllipsisConfig(data, focusArea, value, 'maxToEllipsis');
        }
      }
    },
    {
      title: '省略提示框仅显示多余项',
      type: 'Switch',
      description: '开启后，省略提示框内仅展示多余标签项',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return (
          item.contentType === 'tag' &&
          getEllipsisConfig(data, focusArea, 'useEllipsis') &&
          getEllipsisConfig(data, focusArea, 'maxToEllipsis') > 0
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getEllipsisConfig(data, focusArea, 'onlyShowOver');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setEllipsisConfig(data, focusArea, value, 'onlyShowOver');
        }
      }
    },
    {
      title: '省略提示框触发模式',
      type: 'Radio',
      description: '通过点击/悬浮来显示省略项提示框',
      options: [
        { label: '点击', value: 'click' },
        { label: '聚焦', value: 'hover' }
      ],
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return (
          item.contentType === 'tag' &&
          getEllipsisConfig(data, focusArea, 'useEllipsis') &&
          getEllipsisConfig(data, focusArea, 'maxToEllipsis') > 0
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getEllipsisConfig(data, focusArea, 'trigger');
        },
        set({ data, focusArea }: EditorResult<Data>, value: 'click' | 'hover') {
          if (!focusArea) return;
          setEllipsisConfig(data, focusArea, value, 'trigger');
        }
      }
    }
  ]
};

export default TagItemEditor;
