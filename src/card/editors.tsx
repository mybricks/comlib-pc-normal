import { Data } from './constants';

export default {
  ':root': [
    {
      title: '标题内容',
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.title;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.title = value;
        }
      }
    },
    {
      title: '卡片边框',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.bordered;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.bordered = value;
        }
      }
    },
    {
      title: '开启卡片右上角操作',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useExtra;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useExtra = value;
        }
      }
    },
    {
      title: '鼠标移过时可浮起',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.hoverable;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.hoverable = value;
        }
      }
    },
    {
      title: '尺寸',
      type: 'select',
      options: [
        {
          label: '正常',
          value: 'default'
        },
        {
          label: '小',
          value: 'small'
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set({ data }: EditorResult<Data>, value: 'default' | 'small') {
          data.size = value;
        }
      }
    }
    // {
    //   title: '宽度',
    //   type: 'slider',
    //   options: {
    //     min: 0,
    //     max: 2000,
    //     step: 100,
    //     formatter: 'px'
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.style.width ? parseInt(data.style.width) : 0;
    //     },
    //     set({ data }: EditorResult<Data>, value: number) {
    //       const { width, ...res } = data.style;
    //       if (value) {
    //         res.width = `${value}px`;
    //         data.style = res;
    //       }
    //     }
    //   }
    // }
  ]
  // '.ant-card-body': {
  //   title: '卡片内容',
  //   items: [
  //     {
  //       title: '间距',
  //       type: 'Inputnumber',
  //       options: [
  //         { title: '上', min: 0, max: 50, width: 50 },
  //         { title: '左', min: 0, max: 50, width: 50 },
  //         { title: '下', min: 0, max: 50, width: 50 },
  //         { title: '右', min: 0, max: 50, width: 50 }
  //       ],
  //       value: {
  //         get({ data }: EditorResult<Data>) {
  //           const { paddingTop, paddingLeft, paddingBottom, paddingRight } =
  //             data.bodyStyle;
  //           return [paddingTop, paddingLeft, paddingBottom, paddingRight];
  //         },
  //         set({ data }: EditorResult<Data>, value: number[]) {
  //           const [paddingTop, paddingLeft, paddingBottom, paddingRight] =
  //             value;
  //           data.bodyStyle = {
  //             ...data.bodyStyle,
  //             paddingTop,
  //             paddingLeft,
  //             paddingBottom,
  //             paddingRight
  //           };
  //         }
  //       }
  //     }
  //   ]
  // }
};
