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

// {
//   title: '图标选择',
//   ifVisible(props: EditorResult<Data>) {
//     return getMenuItem(props, 'useIcon') || false;
//   },
//   items: [
//     {
//       title: '自定义',
//       type: 'switch',
//       value: {
//         get(props: EditorResult<Data>) {
//           return getMenuItem(props, 'isCustom') || false;
//         },
//         set(props: EditorResult<Data>, value: boolean) {
//           setMenuItem(props, 'isCustom', value);
//         }
//       }
//     },
//     { 
//       title: '图标库',
//       type: 'Icon',
//       ifVisible(props: EditorResult<Data>) {
//         return !getMenuItem(props, 'isCustom');
//       },
//       value: {
//         get(props: EditorResult<Data>) {
//           return getMenuItem(props, 'isCustom');
//         },
//         set(props: EditorResult<Data>, value: string) {
//           setMenuItem(props, 'icon', value || "HomeOutlined");
//         }
//       }
//     },
//     {
//       title: '上传',
//       type: 'ImageSelector',
//       ifVisible(props: EditorResult<Data>) {
//         return getMenuItem(props, 'isCustom');
//       },
//       value: {
//         get(props: EditorResult<Data>) {
//           return getMenuItem(props, 'src') || "";
//         },
//         set(props: EditorResult<Data>, value: string) {
//           setMenuItem(props, 'src', value);
//         }
//       }
//     },
//     {
//       title: '尺寸',
//       type: 'InputNumber',
//       options: [
//         { title: '高度', min: 0, width: 100 },
//         { title: '宽度', min: 0, width: 100 }
//       ],
//       value: {
//         get(props: EditorResult<Data>) {
//           return getMenuItem(props, 'contentSize') || [14, 14];
//         },
//         set(props: EditorResult<Data>, value: [number, number]) {
//           setMenuItem(props, 'contentSize', value);
//         }
//       }
//     }
//   ]
// }