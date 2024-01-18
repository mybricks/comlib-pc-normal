import { Data, IconType } from './types';
import { SelectOptionFilterPropsType } from './const';

const items = (data: Data) => [
  {
    title: '字段配置',
    items: [
      {
        title: '标题字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 label'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.labelFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.labelFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
      {
        title: '值字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 value'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.valueFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.valueFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
      {
        title: '叶子节点字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 children'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.childrenFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.childrenFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
    ]
  },
  {
    title: '节点图标',
    type: 'array',
    description: `图标动态显示表达式约定以“node”开头, node表示当前节点, 如{node._depth===0}: 当前节点为根节点时显示`,
    options: {
      addText: '添加图标',
      editable: true,
      getTitle(item) {
        return `${item.title} ${item.displayExpression}`;
      },
      onAdd(): IconType {
        return {
          title: '图标',
          src: 'inner',
          size: [14, 14],
          gutter: [8],
          innerIcon: 'FolderOpenOutlined',
          displayRule: 'default',
          customIcon: '',
          displayExpression: ''
        };
      },
      items: [
        {
          title: '名称',
          type: 'text',
          value: 'title'
        },
        {
          title: '尺寸',
          type: 'InputNumber',
          options: [
            { title: '高度', min: 0, width: 100 },
            { title: '宽度', min: 0, width: 100 }
          ],
          value: 'size'
        },
        // {
        //   title: '间隔',
        //   type: 'InputNumber',
        //   options: [
        //     { min: 0, width: 100 },
        //   ],
        //   value: 'gutter'
        // },
        {
          title: '图标来源',
          type: 'Radio',
          options: [
            { label: '无', value: false },
            { label: '内置图标库', value: 'inner' },
            { label: '自定义上传', value: 'custom' }
          ],
          value: 'src'
        },
        {
          title: '图标库',
          type: 'Icon',
          ifVisible(item: any) {
            return item.src === 'inner';
          },
          value: 'innerIcon'
        },
        {
          title: '上传',
          type: 'ImageSelector',
          ifVisible(item: any) {
            return item.src === 'custom';
          },
          value: 'customIcon'
        },
        {
          title: '应用节点',
          type: 'Radio',
          options: [
            { label: '所有节点', value: 'default' },
            { label: '自定义节点', value: 'dynamic' }
          ],
          value: 'displayRule'
        },
        {
          title: '动态显示表达式',
          type: 'expression',
          options: {
            suggestions: getSuggestions(data),
            placeholder: `例：{node._depth===0} 图标应用在根节点上`,
          },
          ifVisible(item: any) {
            return item.displayRule === 'dynamic';
          },
          value: 'displayExpression',
        }
      ]
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return [...(data.icons || [])];
      },
      set({ data }: EditorResult<Data>, val: Array<IconType>) {
        data.icons = val;
      }
    }
  },
  {
    title: '搜索功能',
    items: [
      {
        title: '支持搜索',
        type: 'Switch',
        description: '开启后可输入内容搜索',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.showSearch;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.config.showSearch = value;
          }
        }
      },
      {
        title: '搜索规则',
        type: 'Select',
        options: [
          {
            label: '根据名称搜索',
            value: SelectOptionFilterPropsType.Label
          },
          {
            label: '根据值搜索',
            value: SelectOptionFilterPropsType.Value
          }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.showSearch && !data.customOnSearch;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.treeNodeFilterProp;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.config.treeNodeFilterProp = value;
          }
        }
      },
      {
        title: '自定义搜索事件',
        type: 'Switch',
        description: '开启后，可以通过搜索事件，远程请求接口，查询下拉选项',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.config.showSearch;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.customOnSearch;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.customOnSearch = value;
            if (data.customOnSearch === true) {
              data.config.filterTreeNode = false;
              output.add('onSearch', '远程搜索', { type: 'string' });
            } else {
              data.config.filterTreeNode = true;
              output.remove('onSearch');
            }
          }
        }
      },
      {
        title: '搜索事件',
        type: '_event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.showSearch && data.customOnSearch;
        },
        options: {
          outputId: 'onSearch'
        }
      },
    ]
  },
  {
    title: '异步加载',
    type: 'Switch',
    description: '开启后可配置子节点异步加载',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useLoadData;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.useLoadData = value;
      }
    }
  },
  {
    title: '仅首次加载',
    type: 'Switch',
    description: '关闭后，每次展开节点，都会重新触发异步加载',
    ifVisible({ data }: EditorResult<Data>) {
      return data.useLoadData
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.loadDataOnce;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.loadDataOnce = value;
      }
    }
  },
  {
    title: '异步加载输出',
    type: '_event',
    ifVisible({ data }: EditorResult<Data>) {
      return data.useLoadData
    },
    options: {
      outputId: 'loadData'
    }
  },
];
const getSuggestions = (data: Data) => {
  return [
    {
      label: 'node',
      insertText: `node.`,
      detail: `当前节点`,
      properties: [
        {
          label: '_depth',
          insertText: `{_depth}`,
          detail: `当前节点的深度`
        },
        {
          label: 'isLeaf',
          insertText: `{isLeaf}`,
          detail: `当前节点是否为叶子节点`
        },
        {
          label: data.valueFieldName || 'value',
          insertText: `{${data.valueFieldName || 'value'}}` + ' === ',
          detail: `当前节点${data.valueFieldName || 'value'}值`
        },
        {
          label: data.labelFieldName || 'label',
          insertText: `{${data.labelFieldName || 'label'}}` + ' === ',
          detail: `当前节点${data.labelFieldName || 'label'}值`
        },
        {
          label: data.childrenFieldName || 'children',
          insertText: `{${data.childrenFieldName || 'children'}}` + ' === ',
          detail: `当前节点${data.childrenFieldName || 'children'}值`
        },
      ]
    },
  ];
}

const refreshSchema = (data: Data, input, output) => {

  const trueValueFieldName = data.valueFieldName || 'value';
  const trueLabelFieldName = data.labelFieldName || 'label';
  const trurChildrenFieldName = data.childrenFieldName || 'children';

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [trueLabelFieldName]: {
          title: '标签',
          type: 'string'
        },
        [trueValueFieldName]: {
          title: '值',
          type: 'string'
        },
        isLeaf: {
          title: '是否叶子节点',
          type: 'boolean'
        },
        [trurChildrenFieldName]: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  }

  const setOptionsPin = input.get('setOptions')
  const setLoadDataPin = input.get('setLoadData')
  const loadDataPin = output.get('loadData')

  if (setOptionsPin) {
    setOptionsPin.setSchema(schema)
  }

  if (setLoadDataPin) {
    setLoadDataPin.setSchema(schema.items)
  }

  if (loadDataPin) {
    loadDataPin.setSchema(schema.items)
  }
}

export default items;