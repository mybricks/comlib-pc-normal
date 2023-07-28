import {
  Data
} from '../constants';
import { getMenuItem, setMenuItem} from '../utils';

const IconEditor = [
  {
    title: '图标',
    type: 'Switch',
    value: {
      get(props: EditorResult<Data>) {
        return getMenuItem(props, 'useIcon') || false;
      },
      set(props: EditorResult<Data>, value) {
        if(value && !getMenuItem(props, 'icon')){
          setMenuItem(props, 'icon', 'HomeOutlined');
        }
        setMenuItem(props, 'useIcon', value);
      }
    }
  },
  {
    title: '图标选择',
    type: 'icon',
    ifVisible(props: EditorResult<Data>) {
      return getMenuItem(props, 'useIcon');
    },
    value: {
      get(props: EditorResult<Data>) {
        return getMenuItem(props, 'icon')|| 'HomeOutlined';
      },
      set(props: EditorResult<Data>, value: string) {
        setMenuItem(props, 'icon', value);
      }
    }
  }
];

export default IconEditor;