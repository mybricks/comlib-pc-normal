import { Data } from '../constants';
import { addRow, twoColLayout, threeColLayout } from './utils';

const AddRowEditor = [
  {
    title: '添加行',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        addRow(props, 1);
      }
    }
  },
  {
    title: '添加行(2列)',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        addRow(props, 2);
      }
    }
  },
  {
    title: '添加行(3列)',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        addRow(props, 3);
      }
    }
  },
  {
    title: '常用布局',
    items: [
      {
        title: '两栏布局',
        type: 'Button',
        value: {
          set({ data, slot }: EditorResult<Data>) {
            twoColLayout(data, slot)
          }
        }
      },
      {
        title: '三栏布局',
        type: 'Button',
        value: {
          set({ data, slot }: EditorResult<Data>) {
            threeColLayout(data, slot)
          }
        }
      }
    ]
  }
];

export default AddRowEditor;
