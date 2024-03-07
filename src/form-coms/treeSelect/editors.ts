import { Data } from './types';
import BasicEditors from './basicEditors';
import AdvancedEditors from './advancedEditors';
import { createrCatelogEditor } from '../utils';
import { IconEditor } from './iconEditor';
import { SizeEnum, SizeOptions } from '../types';


export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root': {
    style: [
      {
        title: '尺寸',
        description: '控件大小, 默认是中(middle)',
        type: 'Select',
        options: SizeOptions,
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.size || 'middle';
          },
          set({ data }: EditorResult<Data>, val: SizeEnum) {
            data.config = {
              ...data.config,
              size: val
            };
          }
        }
      },
      ...IconEditor('展开/收起图标'),
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '输入框',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-select-selector'
              },
              {
                title: '输入框-提示内容',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                ],
                target: '.ant-select-selector .ant-select-selection-placeholder'
              },
              {
                title: '输入框-清除图标',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-select-allow-clear .ant-select-clear'
              },
              {
                title: '输入框-下拉箭头/搜索图标',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                ],
                target: '.ant-select-show-arrow .ant-select-arrow'
              },
              {
                title: '选中标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-select-selector .ant-select-selection-item'
              },
              {
                title: '选中标签-删除按钮',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                ],
                target: '.ant-select-selector .ant-select-selection-item-remove'
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper`
              },
              {
                title: '勾选框',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox .ant-select-tree-checkbox-inner`
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '输入框',
                options: ['border'],
                target: 'div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector:hover',
                domTarget: 'div.ant-select-selector'
              },
              {
                title: '输入框-清除图标',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                ],
                target: '.ant-select-allow-clear .ant-select-clear:hover'
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper:hover`,
                domTarget: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper`
              },
              {
                title: '勾选框选中',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked:after`
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '输入框',
                options: ['border', 'BoxShadow'],
                target: 'div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) > div.ant-select-selector',
                domTarget: 'div.ant-select-selector'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Select',
            items: [
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected`
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Check',
            items: [
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode.ant-select-tree-treenode-checkbox-checked .ant-select-tree-node-content-wrapper`
              },
              {
                title: '勾选框',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked .ant-select-tree-checkbox-inner`,
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '输入框',
                options: [
                  'border',
                  'font',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-select-disabled .ant-select-selector'
              },
              {
                title: '输入框-提示内容',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                ],
                target: '.ant-select-disabled .ant-select-selector .ant-select-selection-placeholder'
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode.ant-select-tree-treenode-disabled span.ant-select-tree-node-content-wrapper`
              },
              {
                title: '勾选框',
                options: [
                  { type: 'border', config: { useImportant: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked.ant-select-tree-checkbox-disabled .ant-select-tree-checkbox-inner`,
              },
            ]
          })
        ]
      }
    ],
    items: ({ data }: EditorResult<Data>, ...catalog) => {
      catalog[0].title = '常规';
      catalog[0].items = BasicEditors;

      catalog[1].title = '高级'
      catalog[1].items = AdvancedEditors(data);

    }
  }
}
