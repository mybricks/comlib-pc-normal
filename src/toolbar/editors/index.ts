import { Data, ShapeEnum, SizeEnum, TypeEnum } from '../types';
import ItemEditor from './items';
import StyleEditor from './styleEditor';
import AddEditor from './addEditor';
import EllipsisEditor from './ellipsisEditor';

export default {
  '@resize': {
    options: ['width', 'height']
  },
  '@init': ({ style }) => {
    style.height = 'auto';
  },
  ':root': {
    title: '工具条',
    items: [...AddEditor, ...StyleEditor, ...EllipsisEditor],
    style: [
      {
        title: '尺寸',
        type: 'Select',
        options() {
          return [
            { value: SizeEnum.Large, label: '大' },
            { value: SizeEnum.Middle, label: '中等' },
            { value: SizeEnum.Small, label: '小' }
          ];
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.allSize || SizeEnum.Middle;
          },
          set({ data }: EditorResult<Data>, value: SizeEnum) {
            data.allSize = value;
          }
        }
      },
      {
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: TypeEnum.Primary, label: '主按钮' },
            { value: TypeEnum.Default, label: '次按钮' },
            { value: TypeEnum.Dashed, label: '虚线按钮' },
            { value: TypeEnum.Link, label: '链接按钮' },
            { value: TypeEnum.Text, label: '文字按钮' }
          ];
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.allType || TypeEnum.Default;
          },
          set({ data }: EditorResult<Data>, value: TypeEnum) {
            data.allType = value;
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.allDanger;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.allDanger = value;
          }
        }
      },
      {
        title: '形状',
        type: 'Select',
        options() {
          return [
            { value: ShapeEnum.Default, label: '默认' },
            { value: ShapeEnum.Circle, label: '(椭)圆' },
            { value: ShapeEnum.Round, label: '圆角矩形' }
          ];
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.allShape || ShapeEnum.Default;
          },
          set({ data }: EditorResult<Data>, value: ShapeEnum) {
            data.allShape = value;
          }
        }
      },
      {
        items: [
          {
            catelog: '默认',
            title: '工具条背景',
            options: [{ type: 'background' }],
            target: `div.mybricks-toolbar`
          },
          {
            options: ['size'],
            catelog: '默认',
            target({}) {
              return `div[data-btn-idx]`;
            }
          },
          {
            title: '按钮样式',
            catelog: '默认',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({}) {
              return `button`;
            }
          },
          {
            title: '按钮样式',
            catelog: 'Hover',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({}) {
              return `button.ant-btn:not([disabled]):hover`;
            }
          },
          {
            title: '按钮样式',
            catelog: '激活',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({}) {
              return `button.ant-btn:not([disabled]):active`;
            }
          },
          {
            title: '按钮样式',
            catelog: '禁用',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({}) {
              return `button.ant-btn[disabled],
                      button.ant-btn[disabled]:active,
                      button.ant-btn[disabled]:focus,
                      button.ant-btn[disabled]:hover`;
            }
          }
        ]
      }
    ]
  },
  ...ItemEditor
};
