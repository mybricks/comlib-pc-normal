import { Data } from '../types'
import { message } from 'antd';
import { inputIds } from '../constants'
import iconEditor from './iconEditor';
import { createrCatelogEditor } from '../../utils/index';

const getAcitonsItem = (focusArea, actions) => {
  const itemId = focusArea.dataset['formActionsItem'];
  const item = actions.find((item) => item.key === itemId);

  return item;
};

const actionItemEditor = {
  '[data-form-actions-item]': {
    title: '操作',
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }) {
          if (!focusArea) return;
          const comId = focusArea.dataset['formActionsItem'];
          const item = data.actions.items.find((item) => item.key === comId);
          return item.title;
        },
        set({ data, focusArea, input, output }, value) {
          const comId = focusArea.dataset['formActionsItem'];
          const item = data.actions.items.find((item) => item.key === comId);
          item.title = value;
        }
      }
    },
    style: [
      {
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: 'primary', label: '主按钮' },
            { value: 'default', label: '次按钮' },
            { value: 'dashed', label: '虚线按钮' },
            { value: 'link', label: '链接按钮' },
            { value: 'text', label: '文字按钮' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string;

            return data.actions.items.find((item) => item.key === comId)?.type || 'default';
          },
          set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);

            if (item) {
              item.type = value;
            }
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string;

            return data.actions.items.find((item) => item.key === comId)?.danger;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);

            if (item) {
              item.danger = value;
            }
          }
        }
      },
      ...iconEditor,
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"] .icon`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                catelog: 'Hover',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:hover`;
                },
                domTarget({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:hover .icon`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '激活',
            items: [
              {
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  'background'
                ],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:active`;
                },
                domTarget({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]`;
                }
              },
              {
                title: '图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target({ focusArea }) {
                  return `button[data-form-actions-item="${focusArea.dataset['formActionsItem']}"]:active .icon`;
                }
              }
            ]
          })
        ]
      }
    ],
    items: ({ env }: EditorResult<Data>, cate1, cate2) => {
      (cate1.title = '操作'),
        (cate1.items = [
          {
            title: '显示',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const comId = focusArea.dataset.formActionsItem as string;
                return data.actions.items.find((item) => item.key === comId)?.visible;
              },
              set({ data, focusArea, output }: EditorResult<Data>, val) {
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);
                if (item) {
                  item.visible = val;
                }
              }
            }
          },
          {
            title: '标题',
            type: 'text',
            options: {
              locale: true
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const comId = focusArea.dataset.formActionsItem as string;
                return comId && data.actions.items.find((item) => item.key === comId)?.title;
              },
              set({ data, focusArea, output, input }: EditorResult<Data>, val) {
                if (!val) {
                  return message.warn('操作标题不能为空');
                }

                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);
                if (item) {
                  item.title = val;
                  const title = env.i18n(item?.title);
                  output.setTitle(item.outputId, `点击${title}`);

                  const setTitle = (key: string, title: string) => {
                    if (input.get(key)) {
                      input.setTitle(key, title);
                    }
                  };

                  if (item.useDynamicDisabled) {
                    const eventKey1 = `${inputIds.SetEnable}_${item?.key}`;
                    const eventKey2 = `${inputIds.SetDisable}_${item?.key}`;

                    setTitle(eventKey1, `启用-"${title}"`);
                    setTitle(eventKey2, `禁用-"${title}"`);
                  }
                  if (item.useDynamicHidden) {
                    const eventKey1 = `${inputIds.SetShow}_${item?.key}`;
                    const eventKey2 = `${inputIds.SetHidden}_${item?.key}`;

                    setTitle(eventKey1, `显示-"${title}"`);
                    setTitle(eventKey2, `隐藏-"${title}"`);
                  }
                }
              }
            }
          },
          {
            title: '权限',
            type: '_permission',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                const item = getAcitonsItem(focusArea, data.actions.items);

                return item?.permission;
              },
              set(params: EditorResult<Data>, val: ConfigPermission) {
                const { data, focusArea, output } = params;

                const item = getAcitonsItem(focusArea, data.actions.items);

                if (item) {
                  item['permission'] = val;
                  val.register?.();
                }
              }
            }
          },
          {
            title: '事件',
            items: [
              {
                title: '点击',
                type: '_event',
                options({ data, focusArea }) {
                  // const comId = focusArea.dataset['formActionsItem'];
                  // const item = data.actions.items.find((item) => item.key === comId);
                  const item = getAcitonsItem(focusArea, data.actions.items);
                  if (!item) return;

                  return {
                    outputId: item.outputId
                  };
                }
              }
            ]
          },
          {
            title: '删除',
            type: 'Button',
            ifVisible({ data, focusArea }) {
              // const actions = data.actions.items;
              // const itemId = focusArea.dataset['formActionsItem'];
              // const item = actions.find((item) => item.key === itemId);
              const item = getAcitonsItem(focusArea, data.actions.items);

              return item && !item?.isDefault;
            },
            value: {
              set({ data, output, focusArea, removePermission }: EditorResult<Data>) {
                const actions = data.actions.items;
                const itemId = focusArea.dataset['formActionsItem'];
                const index = actions.findIndex((item) => item.key === itemId);
                const item = data.actions.items[index];

                if (item?.permission) {
                  removePermission(item.permission?.id);
                  item.permission = undefined;
                }

                output.remove(item.outputId);
                actions.splice(index, 1);
              }
            }
          }
        ]),
        (cate2.title = '高级'),
        (cate2.items = [
          {
            title: '动态启用/禁用',
            description:
              '开启后增加【启动-${按钮标题}】、【禁用-${按钮标题}】两个输入事件，支持在逻辑编排中对当前按钮进行控制（${按钮标题} 为当前按钮的标题）',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const comId = focusArea.dataset.formActionsItem as string;
                return (
                  comId && data.actions.items.find((item) => item.key === comId)?.useDynamicDisabled
                );
              },
              set({ data, focusArea, input, output, env }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);

                const eventKey1 = `${inputIds.SetEnable}_${item?.key}`;
                const eventKey2 = `${inputIds.SetDisable}_${item?.key}`;

                const event1 = input.get(eventKey1);
                const event2 = input.get(eventKey2);
                const title = env.i18n(item?.title);
                if (value) {
                  if (!event1) {
                    input.add(eventKey1, `启用-"${title}"`, { type: 'any' });
                    output.add(`${eventKey1}Done`, '启用完成', { type: 'any' });
                    input.get(eventKey1).setRels([`${eventKey1}Done`]);
                  }
                  if (!event2) {
                    input.add(eventKey2, `禁用-"${title}"`, { type: 'any' });
                    output.add(`${eventKey2}Done`, '禁用完成', { type: 'any' });
                    input.get(eventKey2).setRels([`${eventKey2}Done`]);
                  }
                } else {
                  if (event1) {
                    input.remove(eventKey1);
                    output.remove(`${eventKey1}Done`);
                  }
                  if (event2) {
                    input.remove(eventKey2);
                    output.remove(`${eventKey2}Done`);
                  }
                }
                if (item) {
                  item.useDynamicDisabled = value;
                }
              }
            }
          },
          {
            title: '动态显示/隐藏',
            description:
              '开启后增加【显示-${按钮标题}】、【隐藏-${按钮标题}】两个输入事件，支持在逻辑编排中对当前按钮进行控制（${按钮标题} 为当前按钮的标题）',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const comId = focusArea.dataset.formActionsItem as string;
                return (
                  comId && data.actions.items.find((item) => item.key === comId)?.useDynamicHidden
                );
              },
              set({ data, focusArea, input, output, env }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const comId = focusArea.dataset['formActionsItem'];
                const item = data.actions.items.find((item) => item.key === comId);

                const eventKey1 = `${inputIds.SetShow}_${item?.key}`;
                const eventKey2 = `${inputIds.SetHidden}_${item?.key}`;

                const event1 = input.get(eventKey1);
                const event2 = input.get(eventKey2);
                const title = env.i18n(item?.title);
                if (value) {
                  if (!event1) {
                    input.add(eventKey1, `显示-"${title}"`, { type: 'any' });
                    output.add(`${eventKey1}Done`, '显示完成', { type: 'any' });
                    input.get(eventKey1).setRels([`${eventKey1}Done`]);
                  }
                  if (!event2) {
                    input.add(eventKey2, `隐藏-"${title}"`, { type: 'any' });
                    output.add(`${eventKey2}Done`, '隐藏完成', { type: 'any' });
                    input.get(eventKey2).setRels([`${eventKey2}Done`]);
                  }
                } else {
                  if (event1) {
                    input.remove(eventKey1);
                    output.remove(`${eventKey1}Done`);
                  }
                  if (event2) {
                    input.remove(eventKey2);
                    output.remove(`${eventKey2}Done`);
                  }
                }
                if (item) {
                  item.useDynamicHidden = value;
                }
              }
            }
          }
        ]);
    }
  }
}

export default actionItemEditor;