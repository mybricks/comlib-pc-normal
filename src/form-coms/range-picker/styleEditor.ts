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
                title: '边框',
                options: ['border'],
                target: '.ant-picker'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker'
              },
              {
                title: '日历图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-calendar'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '日期-当前',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner:before`;
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell-today`;
                }
              },
              {
                title: '日期',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} .ant-picker-cell .ant-picker-cell-inner`];
                }
              },
              {
                title: '时间',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner`;
                }
              },
              {
                title: '箭头',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-range-arrow:before`
                }
              },
              {
                title: '下拉区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-panel-container`
                }
              },
              {
                title: '顶部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header`
                }
              },
              {
                title: '底部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-body`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button`
                }
              },
              {
                title: '确认按钮',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  'BoxShadow'
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-btn-primary`;
                }
              },
            ]
          },
          {
            title: 'Hover',
            items: [
              {
                title: '边框-hover',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '日期',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`;
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button:hover`
                }
              }
            ]
          },
          {
            title: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target: ['.ant-picker-focused.ant-picker']
              },
              {
                title: '边框底线',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker-range .ant-picker-active-bar'
              },
            ]
          },
          {
            title: 'Select',
            items: [
              {
                title: '日期-选中',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):not(.ant-picker-cell-range-start) .ant-picker-cell-inner`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):not(.ant-picker-cell-range-end) .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '日期-选中区间',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
                  ];
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} td.ant-picker-cell.ant-picker-cell-in-view.ant-picker-cell-in-range`];
                }
              },
              {
                title: '时间-选中',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`;
                }
              },
              {
                title: '确认按钮',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id}  .ant-btn-primary:active`
              },
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '表单项',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker.ant-picker-disabled'
              },
              {
                title: '确认按钮',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id}  .ant-btn-primary[disabled]`
              }
            ]
          },
        ]
      },
      {
        title: '周',
        catalogs: [
          {
            title: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-picker'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker'
              },
              {
                title: '日历图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-calendar'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '日期-当前',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner:before`;
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell-today`;
                }
              },
              {
                title: '日期-周',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true, useImportant: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`];
                }
              },
              {
                title: '箭头',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-range-arrow:before`
                }
              },
              {
                title: '下拉区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-panel-container`
                }
              },
              {
                title: '顶部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header`
                }
              },
              {
                title: '底部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-body`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button`
                }
              },
            ]
          },
          {
            title: 'Hover',
            items: [
              {
                title: '边框-hover',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '选中日期区间',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end:before`
                  ];
                }
              },
              {
                title: '日期-周',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-week-panel-row:hover td`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button:hover`
                }
              }
            ]
          },
          {
            title: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target: ['.ant-picker-focused.ant-picker']
              },
              {
                title: '边框底线',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker-range .ant-picker-active-bar'
              },
            ]
          },
          {
            title: 'Select',
            items: [
              {
                title: '日期-选中',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} .ant-picker-week-panel-row-selected td`];
                }
              },
              {
                title: '周-选中',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} .ant-picker-week-panel-row-selected td.ant-picker-cell-week`];
                }
              }
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '表单项',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker.ant-picker-disabled'
              }
            ]
          },
        ]
      },
      {
        title: '月份',
        catalogs: [
          {
            title: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-picker'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker'
              },
              {
                title: '日历图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-calendar'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '日期-当前',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner:before`;
                }
              },
              {
                title: '月',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell .ant-picker-cell-inner`,
                    `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '箭头',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-range-arrow:before`
                }
              },
              {
                title: '下拉区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-panel-container`
                }
              },
              {
                title: '顶部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header`
                }
              },
              {
                title: '底部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-body`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button`
                }
              },
            ]
          },
          {
            title: 'Hover',
            items: [
              {
                title: '边框-hover',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '月份',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button:hover`
                }
              }
            ]
          },
          {
            title: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target: ['.ant-picker-focused.ant-picker']
              },
              {
                title: '边框底线',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker-range .ant-picker-active-bar'
              },
            ]
          },
          {
            title: 'Select',
            items: [
              {
                title: '月份',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
                    `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '月-选中区间',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
                  ];
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} td.ant-picker-cell.ant-picker-cell-in-view.ant-picker-cell-in-range`];
                }
              }
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '表单项',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker.ant-picker-disabled'
              }
            ]
          },
        ]
      },
      {
        title: '季度',
        catalogs: [
          {
            title: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-picker'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker'
              },
              {
                title: '日历图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-calendar'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '季度',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell .ant-picker-cell-inner`,
                    `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '箭头',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-range-arrow:before`
                }
              },
              {
                title: '下拉区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-panel-container`
                }
              },
              {
                title: '顶部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header`
                }
              },
              {
                title: '底部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-body`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button`
                }
              },
            ]
          },
          {
            title: 'Hover',
            items: [
              {
                title: '边框-hover',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '季度',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button:hover`
                }
              }
            ]
          },
          {
            title: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target: ['.ant-picker-focused.ant-picker']
              },
              {
                title: '边框底线',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker-range .ant-picker-active-bar'
              },
            ]
          },
          {
            title: 'Select',
            items: [
              {
                title: '季度',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
                    `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '季度-选中区间',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
                  ];
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} td.ant-picker-cell.ant-picker-cell-in-view.ant-picker-cell-in-range`];
                }
              }
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '表单项',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker.ant-picker-disabled'
              }
            ]
          },
        ]
      },
      {
        title: '年份',
        catalogs: [
          {
            title: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-picker'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker'
              },
              {
                title: '日历图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-calendar'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '年份',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell .ant-picker-cell-inner`,
                    `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '箭头',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-range-arrow:before`
                }
              },
              {
                title: '下拉区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-panel-container`
                }
              },
              {
                title: '顶部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header`
                }
              },
              {
                title: '底部操作区域',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-body`
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button`
                }
              }
            ]
          },
          {
            title: 'Hover',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '年份',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '顶部操作日期',
                options: [
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-picker-header-view button:hover`
                }
              }
            ]
          },
          {
            title: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target: ['.ant-picker-focused.ant-picker']
              },
              {
                title: '边框底线',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker-range .ant-picker-active-bar'
              },
            ]
          },
          {
            title: 'Select',
            items: [
              {
                title: '年份',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
                    `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
                  ];
                }
              },
              {
                title: '年份-选中区间',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
                    `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
                  ];
                }
              },
              {
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return [`.{id} td.ant-picker-cell.ant-picker-cell-in-view.ant-picker-cell-in-range`];
                }
              }
            ]
          },
          {
            title: '禁用',
            items: [
              {
                title: '表单项',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-picker.ant-picker-disabled'
              }
            ]
          }
        ]
      }
    ]
  },
]

export default styleEditor;
