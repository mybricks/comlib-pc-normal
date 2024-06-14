import { uuid } from "../utils"

export interface Option {
  title: string
  visible: boolean
  key?: string
  id?: string
  value?: any
}

export default {
  '@init'({ setDesc }) {
    setDesc("未选择组件")
  },
  ':root': [
    {
      title: '选择组件',
      type: 'sceneComSelector',
      options: {
        filter: ({ namespace}) => {
          return namespace === 'mybricks.basic-comlib.popup'
        }
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          data.comDef = comDef
          setDesc(comDef.title)
        }
      }
    },
    {
      title: '对话框标题',
      type: 'text',
      options: {
        locale: true
      },
      ifVisible({ data }) {
        return !data.hideTitle;
      },
      value: {
        get({ data }) {
          return data.title;
        },
        set({ data }, value: string) {
          data.title = value;
        }
      }
    },
    {
      title: '隐藏标题',
      type: 'Switch',
      value: {
        get({ data }) {
          return data.hideTitle;
        },
        set({ data }, value: boolean) {
          data.hideTitle = value;
        }
      }
    },
    {
      title: '静态配置对话框内容',
      description: '若和动态输入中的数据同时存在，以动态输入里面要添加的组件内容为准',
      type: 'Switch',
      value: {
        get({ data }) {
          return data.useStaticData;
        },
        set({ data }, value: boolean) {
          data.useStaticData = value;
        }
      }
    },
    {
      title: '添加组件',
      type: 'comSelector',
      ifVisible({ data }) {
        return data.useStaticData;
      },
      options: {
        rtType: 'ui',
        type: 'add'
      },
      value: {
        set({ data, setDesc }, comDef) {
          if(data.comList?.length) {
            data.comList.push(comDef)
          }else {
            data.comList = [comDef]
          }
        }
      }
    },
    {
      title: '',
      type: 'array',
      ifVisible({ data }) {
        return data.useStaticData
      },
      options: {
        editable: false,
        addable: false,
        getTitle: (item) => {
          return item.title;
        },
      },
      value: {
        get({ data }) {
          return data.comList;
        },
        set({ data, }, options: Option[]) {
          data.comList = options;
        }
      }
    },
    {
      title: '底部操作区域显示',
      description: '若选择不显示，整个操作栏及内部新增的操作隐藏',
      type: 'Switch',
      value: {
        get({ data }) {
          return data.useFooter;
        },
        set({ data }, value: boolean) {
          data.useFooter = value;
        }
      }
    },
    {
      title: '新增操作',
      type: 'array',
      options: {
        addText: '添加操作',
        getTitle: ({ label, checked }) => {
          return label;
        },
        onAdd: () => {
          const value = uuid('_', 2);
          const defaultOption = {
            label: `操作项${value}`,
            value: `操作项${value}`,
            visible: true,
            key: value,
          };
          return defaultOption;
        },
        items: [
          {
            title: '显示',
            type: 'switch',
            value: 'visible'
          },
          {
            title: '名称',
            type: 'text',
            value: 'label'
          }
        ]
      },
      value: {
        get({ data }) {
          return data.actionOptions;
        },
        set({ data, }, options: Option[]) {
          data.actionOptions = options.map(item => {
            return { ...item, visible: item.visible === false ? false : true}
          });
        }
      }
    }
  ]
}