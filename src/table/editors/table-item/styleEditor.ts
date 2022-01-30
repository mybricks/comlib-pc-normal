import { setCol } from '../../schema';
import { Data } from '../../types';

const StyleEditor = {
  title: '样式配置',
  items: [
    {
      title: '宽度(px)',
      type: 'Text',
      description: '列宽（像素）,若填写自动或不填写则组件默认分配宽度',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item && (item.width || '自动');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          let width: string | number | undefined = value;
          if (typeof value === 'number') {
            width = value;
          } else {
            width = value && value.match(/^[1-9]\d*$/gi) ? ~~value : void 0;
          }
          setCol(data, focusArea, width, 'width');
        }
      }
    },
    {
      title: '对齐方式',
      type: 'Select',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中对齐', value: 'center' },
        { label: '右对齐', value: 'right' }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.align || 'left';
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'align');
        }
      }
    },
    {
      title: '固定列',
      type: 'Select',
      description: '对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据',
      options: [
        { value: '', label: '默认' },
        { value: 'left', label: '左固定' },
        { value: 'right', label: '右固定' }
      ],
      // ifVisible({ data, focusArea }: EditorResult<Data>) {
      //   const item = data.columns[focusArea.dataset.tableThIdx];
      //   return (
      //     focusArea.dataset.tableThIdx === 0 ||
      //     focusArea.dataset.tableThIdx === data.columns.length - 1 ||
      //     !!item.fixed
      //   );
      // },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.fixed;
        },
        set({ data, focusArea }, value: string) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'fixed');
        }
      }
    }
  ]
};

export default StyleEditor;
