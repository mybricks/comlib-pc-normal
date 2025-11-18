import { Data, LabelWidthType } from '../types'
import { uuid } from '../../../utils'
import visibleOpt from '../../../components/editorRender/visibleOpt'
import { outputIds } from '../constants'

export const actionsEditor = (data: Data, output, env) => {
  return {
    title: '操作区',
    items: [
      {
        title: '启用编辑表单',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.enableEditForm
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.enableEditForm = val
          }
        }
      },
      {
        title: '临界数量',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.enableEditForm;
        },
        description: '超过这个数量将显示展开/收起按钮',
        type: 'InputNumber',
        options: [{ min: 0, width: 120 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.actions.enableEditFormExpandShowNum]
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.enableEditFormExpandShowNum = val[0]
          }
        }
      },
      {
        title: '是否默认展开',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.enableEditForm;
        },
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.enableEditFormExpandDefaultOpen
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.enableEditFormExpandDefaultOpen = val
          }
        }
      },
      {
        title: '收起时表单高度',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.enableEditForm;
        },
        description: '可以根据自己的需要修改收起时的高度实现收起状态展示一行/两行/三行等效果',
        type: 'InputNumber',
        options: [{ min: 0, width: 120 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.actions.enableEditFormExpandHeight ?? 160]
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.enableEditFormExpandHeight = val[0]
          }
        }
      },
      {
        title: '事件',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.enableEditForm;
        },
        items: [
          {
            title: '提交',
            description: '即使不新建事件仍会触发提交',
            type: '_event',
            options: {
              outputId: 'onClickOperateSearch'
            }
          },
          {
            title: '重置',
            description: '即使不新建事件仍会触发重置',
            type: '_event',
            options: {
              outputId: 'onClickOperateReset'
            }
          }
        ]
      },
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.visible
          },
          set({ data }: EditorResult<Data>, val) {
            data.actions.visible = val
          }
        }
      },
      {
        title: '展开文案',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.expandText;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.expandText = value;
          }
        }
      },
      {
        title: '收起文案',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.collapsedText;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.collapsedText = value;
          }
        }
      },
      {
        title: '宽度模式',
        type: 'Select',
        options: [
          {
            label: '24栅格',
            value: 'span'
          },
          {
            label: '固定宽度(px)',
            value: 'px'
          },
          {
            label: '填充剩余宽度',
            value: 'flexFull'
          }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.layout !== 'inline' && data.layoutType !== 'QueryFilter'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.widthOption;
          },
          set({ data }: EditorResult<Data>, value: LabelWidthType) {
            data.actions.widthOption = value;
          }
        },
      },
      {
        title: '宽度配置(共24格)',
        type: 'Slider',
        options: [
          {
            max: 24,
            min: 1,
            step: 1,
            formatter: '/24',
          },
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.widthOption === 'span' && data.config.layout !== 'inline' && data.layoutType !== 'QueryFilter'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.span;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.actions.span = value;
          }
        },
      },
      {
        title: '宽度配置(px)',
        type: 'text',
        options: {
          type: 'number'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.widthOption === 'px' && data.config.layout !== 'inline' && data.layoutType !== 'QueryFilter'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.width;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.actions.width = value;
          }
        },
      },
      {
        title: '对齐方式',
        ifVisible({ data }: EditorResult<Data>) {
          return data.actions.visible && data.layoutType !== 'QueryFilter';
        },
        type: 'Radio',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中对齐', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: 'left' | 'center' | 'right') {
            data.actions.align = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.actions.align;
          },
        },
      },
      {
        title: '收起/展开表单项',
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layoutType === 'QueryFilter'
        },
        options: {
          outputId: outputIds.ON_COLLAPSE
        }
      },
      {
        title: '操作列表',
        description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
        type: 'array',
        options: {
          addText: '添加操作',
          deletable: false,
          editable: false,
          customOptRender: visibleOpt,
          getTitle: (item) => {
            return env.i18n(item?.title);
          },
          onAdd: (_id) => {
            const outputId = uuid()
            const title = `操作${data.actions.items.length + 1}`
            const item = {
              title: title,
              key: outputId,
              outputId,
              isDefault: false,
              visible: true,
              disabled: false,
              useDynamicDisabled: false,
              useDynamicHidden: false,
              useIcon: false,
              iconDistance: 8,
              icon: "HomeOutlined",
              iconLocation: "front"
            }
            output.add(outputId, title, { type: 'any' })
            data.actions.items.push(item)
            return item;
          }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions?.items || [];
          },
          set({ data }: EditorResult<Data>, val: any[]) {
            data.actions.items = val;
          }
        }
      },
    ]
  }
}