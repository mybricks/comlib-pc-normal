import { setCol } from '../../schema';
import { AlignEnum, ContentTypeEnum, Data, FixedEnum } from '../../types';
import { getColumnItem } from '../../utils';

const StyleEditor = {
  title: '样式配置',
  items: [
    {
      title: '宽度(px)',
      type: 'Text',
      description: '列宽（像素）,若填写自动或不填写则组件默认分配宽度',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.contentType !== ContentTypeEnum.Group;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const item = getColumnItem(data, focusArea);
          return item && (item.width || '自动');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          let width: string | number | undefined = value;
          if (typeof value === 'number') {
            width = value;
          } else {
            width = value && value.match(/^[1-9]\d*$/gi) ? ~~value : void 0;
          }
          setCol({ data, focusArea }, 'width', width);
        }
      }
    },
    {
      title: '对齐方式',
      type: 'Select',
      options: [
        { label: '左对齐', value: AlignEnum.Left },
        { label: '居中对齐', value: AlignEnum.Center },
        { label: '右对齐', value: AlignEnum.Right }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.align || AlignEnum.Left;
        },
        set({ data, focusArea }: EditorResult<Data>, value: AlignEnum) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'align', value);
        }
      }
    },
    {
      title: '固定列',
      type: 'Select',
      description: '对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据',
      options: [
        { value: FixedEnum.Default, label: '默认' },
        { value: FixedEnum.Left, label: '左固定' },
        { value: FixedEnum.Right, label: '右固定' }
      ],
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.contentType !== ContentTypeEnum.Group;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.fixed || FixedEnum.Default;
        },
        set({ data, focusArea }, value: FixedEnum) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'fixed', value);
        }
      }
    }
  ]
};

export default StyleEditor;
