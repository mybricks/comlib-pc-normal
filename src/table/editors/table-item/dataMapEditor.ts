import dateItemEditor from './item/dateEditor';
import { setCol } from '../../schema';
import { Data, MappingEnumOption } from '../../types';
import { getColumnItem, getSuggestions } from '../../utils';

const DataMapingEditor = (data: Data) => ({
  title: '数据处理',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return (
      item &&
      ['text', 'color', 'link', 'badge', 'tag', 'date'].includes(item.contentType)
    );
  },
  items: [
    ...dateItemEditor,
    {
      title: '模板字符串',
      type: 'EXPCODE',
      description: '通过表格列字段自定义展示内容，默认为该列字段',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return !['action', 'image', 'switch', 'slotItem'].includes(item.contentType);
      },
      options: {
        autoSize: true,
        placeholder: '例：{startTime}-{endTime}',
        suggestions: getSuggestions({ data }),
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.contentTemplate;
        },
        set(
          { data, focusArea }: EditorResult<Data>,
          value: string
        ) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'contentTemplate');
        }
      }
    },
    {
      title: '字段映射',
      type: 'Switch',
      description: `配置该列数据映射规则。如状态信息（原始数据给到0或1，需要展示为禁用或启用）等`,
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return ['text', 'color', 'link', 'badge', 'tag', 'date'].includes(
          item.contentType
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.isMapping;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'isMapping');
          getColumnItem(data, focusArea).mappingEnum = [];
        }
      }
    },
    {
      title: '映射枚举',
      type: 'Map',
      description: `当需要对字段不存在(undefined)或字段值为空字符串("")等特殊情况进行映射时，键名可以通过预置选项进行设置`,
      options: {
        kType: 'auto',
        kOption: [
          { label: '不存在', value: MappingEnumOption.NOT_EXIST },
          { label: '空字符串', value: MappingEnumOption.EMPTY_STRING },
        ]
      },
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea)
        return item && item.isMapping;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
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
        const item = getColumnItem(data, focusArea);
        return item && ['tag'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
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
        const item = getColumnItem(data, focusArea);
        return item && ['color'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
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
        const item = getColumnItem(data, focusArea);
        return item && ['badge'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item && item.colorEnum;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'colorEnum');
        }
      }
    }
    // {
    //   title: '日期颜色',
    //   type: 'Map',
    //   description:
    //     '配置字段值为不同值时对应的标签颜色。冒号左边字段值，右边颜色；颜色值支持标准颜色单词(例如red)，hex(例如#ff0000)或rgb写法(例如rgb(255,0,0))',
    //   ifVisible({ data, focusArea }: EditorResult<Data>) {
    //     if (!focusArea) return;
    //     const item = getColumnItem(data, focusArea);
    //     return item && ['date'].includes(item.contentType);
    //   },
    //   value: {
    //     get({ data, focusArea }: EditorResult<Data>) {
    //       if (!focusArea) return;
    //       const item = getColumnItem(data, focusArea);
    //       return item && item.colorEnum;
    //     },
    //     set({ data, focusArea }: EditorResult<Data>, value) {
    //       console.log(value,'color')
    //       if (!focusArea) return;
    //       setCol(data, focusArea, value, 'colorEnum');
    //     }
    //   }
    // }
  ]
});

export default DataMapingEditor;
