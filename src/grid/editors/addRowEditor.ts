import { Data } from '../constants';
import { addRow } from './utils';

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
  }
];

export default AddRowEditor;
