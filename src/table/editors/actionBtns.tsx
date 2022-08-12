import { message } from 'antd';
import { getColumnsDataSchema, setDataSchema } from '../schema';
import { Data, Location } from '../types';
import { uuid } from '../../utils';
import { rowSelectionEditor } from './table/rowSelection';
import { getColumnItem, runScript } from '../utils';

interface Props {
  title?: string;
  titleKey: string;
  getTitleItems?: (res: any) => any[];
  btnsKey: string;
  codeDemo?: string;
  getBtns: (res: any) => any[];
  setBtns?: (res: any) => void;
  addBtns: (res: any) => void;
  suggestions?: any[];
  getSuggestions?: (res: any) => any[];
  runScript?: (res: any) => any[];
}
export const getActionBtnsEditor = (props: Props) => {
  const {
    title = '',
    titleKey,
    getTitleItems = () => [],
    btnsKey,
    getBtns,
    setBtns,
    addBtns,
    codeDemo = '例：{status} === 1',
    getSuggestions,
    runScript
  } = props;
  const getActionBtns = getBtns;
  const updateActionBtns = (res) => {
    if (setBtns) {
      setBtns(res);
    }
  };
  function removeActionBtn({ data, focusArea, output }) {
    if (!focusArea) return;
    const btns: any[] = getActionBtns({ data, focusArea });
    const btn = btns[focusArea.index];
    const idx = btns.findIndex((item) => item.id === btn?.id);
    if (idx !== -1) {
      btns.splice(idx, 1);
      output.remove(btn?.id);
    }
    updateActionBtns({ data, focusArea });
  }
  function moveForwardActionBtn({ data, focusArea }) {
    if (!focusArea) return;
    const btns: any[] = getActionBtns({ data, focusArea });
    const btn = btns[focusArea.index];
    const idx = btns.findIndex((item) => item.id === btn?.id);
    if (idx !== -1) {
      btns.splice(idx, 1);
      btns.splice(idx - 1, 0, btn);
    }
    updateActionBtns({ data, focusArea });
  }
  function moveBackActionBtn({ data, focusArea }) {
    if (!focusArea) return;
    const btns: any[] = getActionBtns({ data, focusArea });
    const btn = btns[focusArea.index];
    const idx = btns.findIndex((item) => item.id === btn?.id);
    if (idx !== -1) {
      btns.splice(idx, 1);
      btns.splice(idx + 1, 0, btn);
    }
    updateActionBtns({ data, focusArea });
  }
  function allowMove({ data, focusArea }) {
    if (!focusArea) return;
    const res = [];
    const btns: any[] = getActionBtns({ data, focusArea });
    const btn = btns[focusArea.index];
    const idx = btns.findIndex((item) => item.id === btn?.id);
    if (idx === -1) {
      return res;
    }
    if (idx !== 0) {
      res.push('forward');
    }
    if (idx !== btns.length - 1) {
      res.push('back');
    }
    return res;
  }

  // 默认样式配置-无配置
  const defaultStyle = {
    backgroundColor: null,
    color: null,
    borderColor: null
  };
  // 获取样式配置模版
  const getBtnStyleConfig = (title: string, type: string, attr: string) => ({
    title,
    type,
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        const btn = getActionBtns({ data, focusArea })[focusArea.index];
        return btn?.style ? btn.style[attr] : null;
      },
      set({ data, focusArea }, value) {
        if (!focusArea) return;
        const btn = getActionBtns({ data, focusArea })[focusArea.index];
        if (typeof btn.style == 'undefined') {
          btn.style = Object.assign({}, defaultStyle);
        }
        btn.style[attr] = value;
        updateActionBtns({ data, focusArea });
      }
    }
  });
  return {
    [titleKey]: (props: EditorResult<Data>, cate1) => {
      cate1.title = title || '操作列';
      cate1.items = [
        {
          title: title || '操作列',
          items: [
            {
              title: `添加${title}按钮`,
              type: 'Button',
              value: {
                set({ data, focusArea, output, input }) {
                  addBtns({ data, focusArea, output, input });
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            ...getTitleItems(props)
          ]
        }
      ];
      return { title: title || '操作列' };
    },
    [btnsKey]: ({ data, focusArea }: EditorResult<Data>, ...cateAry) => {
      const suggestions = getSuggestions
        ? getSuggestions({ data, focusArea })
        : props.suggestions;
      cateAry[0].title = '常规';
      cateAry[0].items = [
        {
          title: '名称',
          type: 'Text',
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const btn = getActionBtns({ data, focusArea })[focusArea.index];

              return btn?.title;
            },
            set(
              { data, focusArea, output }: EditorResult<Data>,
              value: string
            ) {
              if (!focusArea) return;
              if (typeof value !== 'string' || value.trim() === '') {
                throw new Error(`请输入正确的按钮标题.`);
              }
              const btn = getActionBtns({ data, focusArea })[focusArea.index];
              btn.title = value;
              output.setTitle(btn.id, value);
              updateActionBtns({ data, focusArea });
              // setTimestamp(data);
            }
          }
        },
        {
          title: '按钮类型',
          type: 'Select',
          options() {
            return [
              { value: '', label: '默认' },
              { value: 'primary', label: '主按钮' },
              { value: 'ghost', label: '次按钮' },
              { value: 'dashed', label: '虚线按钮' },
              { value: 'danger', label: '危险按钮' },
              { value: 'link', label: '链接按钮' },
              { value: 'text', label: '文字按钮' }
            ];
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              const btn = getActionBtns({ data, focusArea })[focusArea.index];
              return btn?.type;
            },
            set({ data, focusArea }: EditorResult<Data>, value) {
              if (!focusArea) return;
              const btn = getActionBtns({ data, focusArea })[focusArea.index];
              btn.style = Object.assign({}, defaultStyle);
              btn.type = value;
              updateActionBtns({ data, focusArea });
              // setTimestamp(data);
            }
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '点击',
              type: '_Event',
              options: ({ data, focusArea }: EditorResult<Data>) => {
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return {
                  outputId: btn?.id
                };
              }
            }
          ]
        },
        {
          title: '删除',
          type: 'Button',
          value: {
            set({ data, focusArea, output }: EditorResult<Data>) {
              if (!focusArea) return;
              const btns = getActionBtns({ data, focusArea });
              if (btns.length === 1) {
                message.error('请至少保留一个按钮');
                return;
              }
              removeActionBtn({ data, focusArea, output });
            }
          }
        },
        {
          title: '前移',
          type: 'Button',
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return allowMove({ data, focusArea }).includes('forward');
          },
          value: {
            set({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              moveForwardActionBtn({ data, focusArea });
            }
          }
        },
        {
          title: '后移',
          type: 'Button',
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return allowMove({ data, focusArea }).includes('back');
          },
          value: {
            set({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return;
              moveBackActionBtn({ data, focusArea });
            }
          }
        }
      ];
      cateAry[1].title = '样式';
      cateAry[1].items = [
        getBtnStyleConfig('字体颜色', 'colorpicker', 'color'),
        getBtnStyleConfig('背景颜色', 'colorpicker', 'backgroundColor'),
        getBtnStyleConfig('边框颜色', 'colorpicker', 'borderColor'),
        {
          title: '图标',
          items: [
            {
              title: '使用图标',
              type: 'Switch',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.useIcon;
                },
                set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  if (!btn.icon) {
                    btn.icon = 'HomeOutlined';
                  }
                  btn.useIcon = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '显示文字',
              type: 'Switch',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.showText === void 0 ? true : btn.showText;
                },
                set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.showText = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '图标位置',
              type: 'Select',
              options: [
                { label: '位于文字前', value: Location.FRONT },
                { label: '位于文字后', value: Location.BACK }
              ],
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.useIcon && btn?.icon?.length && btn?.showText;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.location || Location.FRONT;
                },
                set({ data, focusArea }: EditorResult<Data>, value: Location) {
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.location = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              type: 'Icon',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.useIcon;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.icon;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.icon = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            }
          ]
        }
      ];

      cateAry[2].title = '高级';
      cateAry[2].items = [
        {
          title: '权限控制',
          items: [
            {
              title: '权限Key',
              description: '唯一标识的权限key',
              type: 'text',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.permissionKey;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.permissionKey = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            }
          ]
        },
        {
          title: '逻辑',
          items: [
            {
              title: '隐藏',
              description: `隐藏按钮的表达式（{}, =, <, >, ||, &&）, ${codeDemo}`,
              type: 'EXPCODE',
              options: {
                autoSize: true,
                placeholder: `${codeDemo}`,
                suggestions: suggestions,
                run: runScript
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  if (getSuggestions) {
                    return {
                      value: btn?.isHiddenScript,
                      suggestions: getSuggestions({ data, focusArea })
                    };
                  }
                  return btn?.isHiddenScript;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.isHiddenScript = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '禁用',
              description: `禁用按钮的表达式（{}, =, <, >, ||, &&）, ${codeDemo}`,
              type: 'EXPCODE',
              options: {
                autoSize: true,
                placeholder: `${codeDemo}`,
                suggestions: suggestions,
                run: runScript
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.isDisabledScript;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.isDisabledScript = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            }
          ]
        },
        {
          title: '气泡配置',
          items: [
            {
              title: '气泡确认框',
              description: '开启气泡确认框',
              type: 'Switch',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  return btn?.supportPopover;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.supportPopover = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '图标',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              type: 'Switch',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { useIcon } = btn?.popConfig || {};
                  return useIcon;
                },
                set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.useIcon = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                const { useIcon } = btn?.popConfig || {};
                return btn?.supportPopover && useIcon;
              },
              type: 'Icon',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popIcon = 'ExclamationCircleFilled' } =
                    btn?.popConfig || {};
                  return popIcon;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popIcon = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '气泡标题',
              type: 'Text',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popTitle = '标题' } = btn?.popConfig || {};
                  return popTitle;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popTitle = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '气泡内容',
              type: 'Text',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popContent = '内容' } = btn?.popConfig || {};
                  return popContent;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popContent = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '气泡确认文本',
              type: 'Text',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popOkText = '确认' } = btn?.popConfig || {};
                  return popOkText;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popOkText = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '气泡确认文本',
              type: 'Text',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popCancelText = '取消' } = btn?.popConfig || {};
                  return popCancelText;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popCancelText = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            },
            {
              title: '位置',
              type: 'Select',
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top Left', value: 'topLeft' },
                { label: 'Top Right', value: 'topRight' },
                { label: 'Left Top', value: 'leftTop' },
                { label: 'Left Bottom', value: 'leftBottom' },
                { label: 'Right Top', value: 'rightTop' },
                { label: 'Right Bottom', value: 'rightBottom' },
                { label: 'Bottom Left', value: 'bottomLeft' },
                { label: 'Bottom Right', value: 'bottomRight' }
              ],
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const btn = getActionBtns({ data, focusArea })[focusArea.index];
                return btn?.supportPopover;
              },
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  const { popPlacement = 'top' } = btn?.popConfig || {};
                  return popPlacement;
                },
                set({ data, focusArea }: EditorResult<Data>, value: string) {
                  if (!focusArea) return;
                  const btn = getActionBtns({ data, focusArea })[
                    focusArea.index
                  ];
                  btn.popConfig = btn.popConfig || {};
                  btn.popConfig.popPlacement = value;
                  updateActionBtns({ data, focusArea });
                }
              }
            }
          ]
        }
      ];

      return { title: `${title}按钮` };
    }
  };
};

export const colActionBtnsEditor = getActionBtnsEditor({
  titleKey: '[data-table-action]',
  btnsKey: '[data-table-btn]',
  getSuggestions: ({ data }: EditorResult<Data>) => {
    const res = [];
    data.columns.forEach((col) => {
      if (!res.find((item) => col.dataIndex === item.label)) {
        res.push({
          label: col.dataIndex,
          insertText: `{${col.dataIndex}}` + ' === ',
          detail: `当前行${col.dataIndex}值`
        });
      }
    });
    return res;
  },
  runScript: (script: string) => {
    return runScript(script, {});
  },
  getTitleItems: () => [
    {
      title: '省略展示',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          return item.ellipsisActionBtnsConfig.useEllipsis;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          item.ellipsisActionBtnsConfig.useEllipsis = value;
        }
      }
    },
    {
      title: '省略显示样式',
      type: 'radio',
      options: [
        { label: '点击', value: 'click' },
        { label: '聚焦', value: 'hover' }
      ],
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea, 'colIndex');
        return item.ellipsisActionBtnsConfig.useEllipsis;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          return item.ellipsisActionBtnsConfig.trigger[0];
        },
        set({ data, focusArea }: EditorResult<Data>, value: 'click' | 'hover') {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          item.ellipsisActionBtnsConfig.trigger = [value];
        }
      }
    },
    {
      title: '超过时省略',
      type: 'Inputnumber',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea, 'colIndex');
        return item.ellipsisActionBtnsConfig.useEllipsis;
      },
      options: [{ min: 0, width: '100%' }],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          return [
            item.ellipsisActionBtnsConfig?.maxToEllipsis
          ];
        },
        set({ data, focusArea }: EditorResult<Data>, value: number[]) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea, 'colIndex');
          item.ellipsisActionBtnsConfig.maxToEllipsis =
            value[0];
        }
      }
    }
  ],
  getBtns: ({ data, focusArea }: EditorResult<Data>) => {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea, 'colIndex');
    return item.actionBtns;
  },
  setBtns: ({ data, focusArea }: EditorResult<Data>) => {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea, 'colIndex');
    item.actionBtns = [...item.actionBtns];
  },
  addBtns: ({ data, focusArea, output }: EditorResult<Data>) => {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea, 'colIndex');
    const btns = item.actionBtns;
    const id = uuid();
    const title = `按钮${btns.length}`;
    btns.push({
      id,
      title,
      size: 'small',
      type: 'ghost',
      showText: true
    });
    const paramRules = {
      title: '表格行数据',
      type: 'object',
      properties: getColumnsDataSchema(data.columns)
    };
    output.add(id, title, paramRules);
  }
});
export const headerActionBtnsEditor = getActionBtnsEditor({
  title: '顶部操作',
  titleKey: '[data-table-header-action]',
  btnsKey: '[data-table-header-btn]',
  codeDemo: `支持queryParams(刷新参数)/dataSource(表格数据)/pagination(分页数据) 字段，\n例：{queryParams.status} === 1`,
  suggestions: [
    {
      label: 'queryParams',
      insertText: '{queryParams.${1}} === ',
      detail: '刷新参数'
    },
    {
      label: 'dataSource',
      insertText: '{dataSource.${1}} === ',
      detail: '表格数据'
    },
    {
      label: 'pagination.current',
      insertText: '{pagination.current} === ',
      detail: '当前页码'
    },
    {
      label: 'pagination.pageSize',
      insertText: '{pagination.pageSize} === ',
      detail: '当前条目数'
    },
    {
      label: 'pagination.total',
      insertText: '{pagination.total} === ',
      detail: '当前总数'
    }
  ],
  runScript: (script: string) => {
    return runScript(script, {
      queryParams: {},
      dataSource: [],
      pagination: {}
    });
  },
  getBtns: ({ data }: EditorResult<Data>) => {
    return data.actionBtns;
  },
  addBtns: ({ data, output }: EditorResult<Data>) => {
    const btns = data.actionBtns;
    const id = uuid();
    const title = `按钮${btns.length}`;
    btns.unshift({
      id,
      title,
      showText: true
    });
    const paramRules = {
      title: '表格数据',
      type: 'object',
      properties: getColumnsDataSchema(data.columns)
    };
    output.add(id, title, paramRules);
  }
});

export const batchActionBtnsEditor = getActionBtnsEditor({
  title: '批量操作',
  titleKey: '[data-table-batch-action]',
  btnsKey: '[data-table-batch-btn]',
  codeDemo:
    '支持selectedRows(勾选数据)/selectedRowKeys(勾选数据Key) 字段，\n例：{selectedRowKeys.length} > 1',
  suggestions: [
    {
      label: 'selectedRows',
      insertText: '{selectedRows.length} === ',
      detail: '勾选数据列表'
    },
    {
      label: 'selectedRowKeys',
      insertText: '{selectedRowKeys.length} === ',
      detail: '勾选数据Key列表'
    }
  ],
  runScript: (script: string) => {
    return runScript(script, { selectedRows: [], selectedRowKeys: [] });
  },
  getTitleItems: (props) => [...rowSelectionEditor(props)],
  getBtns: ({ data }: EditorResult<Data>) => {
    return data.batchBtns;
  },
  addBtns: ({ data, input, output }: EditorResult<Data>) => {
    if (!data.batchBtns) {
      data.batchBtns = [];
    }
    const id = uuid();
    const title = `批量操作${data.batchBtns.length}`;
    const paramRules = {
      title: '表格行数据',
      type: 'object',
      properties: getColumnsDataSchema(data.columns)
    };
    data.batchBtns.push({
      id,
      title,
      showText: true
    });

    output.add(id, title, paramRules);
    setDataSchema({ data, input, output });
  }
});
