import { Data } from './runtime';

const styleEditor = [
  {
    catalogs: [
      {
        title: '日期',
        catalogs: [
          {
            title: '默认',
            items: [
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.datePickerContent'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'datePickerContent.datePickerPlaceholder'
              },
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '文本',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                target: `datePickerContent.datePickerDisabled`
              }
            ]
          }
        ]
      },
    ]
  }
];

export default styleEditor;
