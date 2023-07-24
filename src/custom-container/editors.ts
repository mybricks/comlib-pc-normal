import { Data, SlotIds, OverflowEnum } from './constants';
import { OverflowEditor } from './editors/overflowEditor';
import { PageScrollEditor } from './editors/pageSrcollEditor';
import { StyleEditor } from './editors/styleEditor';
import { ClickEditor } from './editors/clickEditor';
import { MaxHeightEditor } from './editors/maxHeightEditor';
import { FixedEditor } from './editors/fixedEditor';
import { getFilterSelector } from '../utils/cssSelector';
import { unitConversion } from '../utils';

const setSlotLayout = (slot, val) => {
  if (!slot) return;
  if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

export default {
  '@init'({ style }: EditorResult<Data>) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({ slot }: EditorResult<Data>, cate1, cate2, cate3) {
      cate1.title = '布局';
      cate1.items = [
        {
          title: '布局',
          type: 'layout',
          options: [],
          value: {
            get({ data, slots }: EditorResult<Data>) {
              const { slotStyle = {} } = data;
              const slotInstance = slots.get('content');
              setSlotLayout(slotInstance, slotStyle);
              return slotStyle;
            },
            set({ data, slots }: EditorResult<Data>, val: any) {
              if (!data.slotStyle) {
                data.slotStyle = {};
              }
              data.slotStyle = {
                ...data.slotStyle,
                ...val
              };
              const slotInstance = slots.get('content');
              setSlotLayout(slotInstance, val);
            }
          }
        },
      ];

      cate2.title = '高级';
      cate2.items = [...ClickEditor, ...PageScrollEditor];

      return {
        title: '自定义容器'
      };
    },
    style: [
      MaxHeightEditor,
      {
        title: '默认',
        options: ['padding', 'border', 'background'],
        target: ({ id }: EditorResult<Data>) => `.root${getFilterSelector(id)}`
      },
      {
        title: '最小宽度',
        type: 'text',
        description: '组件宽度需设置为适应内容/最大可能的宽度',
        options: {
          placeholder: '组件最小宽度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.legacyStyle?.minWidth;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.legacyStyle = {
              ...data.legacyStyle,
              minWidth: unitConversion(value) || ''
            }
          }
        }
      },
      {
        title: '最小高度',
        type: 'text',
        description: '组件高度需设置为适应内容/最大可能的高度',
        options: {
          placeholder: '组件最小高度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.legacyStyle?.minHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.legacyStyle = {
              ...data.legacyStyle,
              minHeight: unitConversion(value) || ''
            }
          }
        }
      },
      {
        title: '最大宽度',
        type: 'text',
        description: '组件宽度需设置为适应内容/最大可能的宽度',
        options: {
          placeholder: '组件最大宽度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.legacyStyle?.maxWidth;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.legacyStyle = {
              ...data.legacyStyle,
              maxWidth: unitConversion(value) || ''
            }
          }
        }
      },
      {
        title: '最大高度',
        type: 'text',
        description: '组件高度需设置为适应内容/最大可能的高度',
        options: {
          placeholder: '组件最大高度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.legacyStyle?.maxHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.legacyStyle = {
              ...data.legacyStyle,
              maxHeight: unitConversion(value) || ''
            }
          }
        }
      },
      {
        title: '上下滚动条',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.overflowY === OverflowEnum.Auto;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.overflowY = value ? OverflowEnum.Auto : OverflowEnum.Hidden;
          }
        }
      },
      {
        title: '左右滚动条',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.overflowX === OverflowEnum.Auto;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.overflowX = value ? OverflowEnum.Auto : OverflowEnum.Hidden;
          }
        }
      },
      {
        title: '超出宽高范围时不隐藏内容',
        description: '无滚动条情况下，超出宽高范围时不隐藏内容',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.overflowX !== OverflowEnum.Auto || data.overflowY !== OverflowEnum.Auto;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useOverflowUnset;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useOverflowUnset = value;
          }
        }
      },
      ...FixedEditor,
      {
        title: 'Hover',
        options: ['padding', 'border', 'background'],
        target: ({ id }: EditorResult<Data>) => `.root:hover${getFilterSelector(id)}`,
        domTarget: '.root'
      }
    ]
  }
};
