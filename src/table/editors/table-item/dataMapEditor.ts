import { setCol } from '../../schema';
import { Data } from '../../types';

const DataMapingEditor = {
  title: '数据映射',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = data.columns[focusArea.dataset.tableThIdx];
    return (
      item &&
      ['text', 'color', 'link', 'badge', 'tag'].includes(item.contentType)
    );
  },
  items: [
    {
      title: '字段映射',
      type: 'Switch',
      description: `配置该列数据映射规则。如状态信息（原始数据给到0或1，需要展示为禁用或启用）等`,
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return ['text', 'color', 'link', 'badge', 'tag'].includes(
          item.contentType
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.isMapping;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'isMapping');
          data.columns[focusArea.dataset.tableThIdx].mappingEnum = [];
        }
      }
    },
    {
      title: '映射枚举',
      type: 'Map',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && item.isMapping;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && item.mappingEnum;
        },
        set({ data, focusArea }: EditorResult<Data>, value: any) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'mappingEnum');
        }
      }
    },
    {
      title: '标签颜色',
      type: 'Map',
      description:
        '配置字段值为不同值时对应的标签颜色。冒号左边字段值，右边颜色；颜色值支持标准颜色单词(red)，hex(#ff0000)或rgb写法(rgb(255,0,0))',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && ['tag'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && item.tagEnum;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'tagEnum');
        }
      }
    },
    {
      title: '文字颜色',
      type: 'Map',
      description:
        '配置字段值为不同值时对应的标签颜色。冒号左边字段值，右边颜色；颜色值支持标准颜色单词(例如red)，hex(例如#ff0000)或rgb写法(例如rgb(255,0,0))',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && ['color'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && item.colorEnum;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'colorEnum');
        }
      }
    },
    {
      title: '状态点颜色',
      type: 'Map',
      description:
        '配置字段值为不同值时对应的标签颜色。冒号左边字段值，右边颜色；颜色值支持标准颜色单词(例如red)，hex(例如#ff0000)或rgb写法(例如rgb(255,0,0))',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && ['badge'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && item.colorEnum;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'colorEnum');
        }
      }
    }
  ]
};

export default DataMapingEditor;
