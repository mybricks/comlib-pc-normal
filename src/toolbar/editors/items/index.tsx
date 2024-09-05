import { BtnItemDataSetKey, InputIds, OutputIds, SlotItemDataSetKey } from '../../constants';
import { Data } from '../../types';
import IndexEditor from './indexEditor';
import DynamicEventEditor from './dynamicEventEditor';
import SlotDynamicEditor from './slotDynamicEditor';
import IconEditor from './iconEditor';
import PermissionEditor from './permissionEditor';
import StyleEditor from './styleEditor';
import EventEditor from './eventEditor';
import BaseEditor from './baseEditor';
import OutputValEditor from './outputValEditor';
import { getBtnItemInfo } from '../../utils';

const itemEditor = {
  [`[${BtnItemDataSetKey}]`]: {
    title: '按钮',
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          return item.text;
        },
        set({ data, focusArea, input, output, env }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          item.text = value;
          const text = env.i18n(item.text);
          output.setTitle(item.key, `单击${text}`);
          output.setTitle(`${OutputIds.DoubleClick}_${item.key}`, `双击${text}`);
          input.setTitle(`${InputIds.SetBtnText}_${item.key}`, `设置${text}名称`);
          input.setTitle(`${InputIds.SetDisable}_${item.key}`, `禁用${text}`);
          input.setTitle(`${InputIds.SetEnable}_${item.key}`, `启用${text}`);
          input.setTitle(`${InputIds.SetHidden}_${item.key}`, `隐藏${text}`);
          input.setTitle(`${InputIds.SetVisible}_${item.key}`, `显示${text}`);
          input.setTitle(`${InputIds.SetBtnStyle}_${item.key}`, `设置${item.text}样式`);
          input.setTitle(`${InputIds.SetBtnOpenLoading}_${item.key}`, `开启${item.text}loading`);
          input.setTitle(`${InputIds.SetBtnCloseLoading}_${item.key}`, `关闭${item.text}loading`);
        }
      }
    },
    style: [
      ...StyleEditor,
      ...IconEditor,
      {
        items: [
          {
            catelog: '默认',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea }) {
              return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button`;
            }
          },
          {
            title: '尺寸',
            options: ['size'],
            catelog: '默认',
            target({ focusArea }) {
              return `div[data-btn-idx="${focusArea.dataset.btnIdx}"]`;
            }
          },
          {
            catelog: 'Hover',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea }) {
              return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn:not([disabled]):hover`;
            }
          },
          {
            catelog: '激活',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea }) {
              return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn:not([disabled]):active`;
            }
          },
          {
            catelog: '禁用',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ focusArea }) {
              // TODO: 由于子作用域组件无法使用数组型 target，暂且通过 #{id} 的形式绕过去
              return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled],
              #{id} div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:active,
              #{id} div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:focus,
              #{id} div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:hover`;
              // return [
              //   `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]`,
              //   `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:active`,
              //   `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:focus`,
              //   `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button.ant-btn[disabled]:hover`
              // ];
            }
          }
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...OutputValEditor, ...EventEditor, ...IndexEditor];

      cate2.title = '高级';
      cate2.items = [...DynamicEventEditor, ...PermissionEditor];

      return {
        title: '按钮'
      };
    }
  },
  [`[${SlotItemDataSetKey}]`]: {
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [...IndexEditor];

      cate2.title = '高级';
      cate2.items = [...SlotDynamicEditor];

      return {
        title: '自定义插槽'
      };
    }
  }
};

export default itemEditor;
