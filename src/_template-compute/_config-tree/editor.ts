export default {
  "@init"({ setDesc }) {
    setDesc("未选择组件");
  },
  ":root": [
    {
      title: '选择组件',
      type: 'sceneComSelector',
      options: {
        filter:({namespace}) => {
          return namespace === 'mybricks.normal-h5.tree'
        }
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          data.comDef = comDef
          setDesc(comDef.label)
        }
      }
    },
    {
      title: '标题字段',
      type: 'Text',
      options: {
        placeholder: '默认值为 title'
      },
      value: {
        get({ data }) {
          return data.titleFieldName || 'title';
        },
        set({ data }, value: string) {
          data.titleFieldName = value;
        }
      }
    },
    {
      title: '标识字段',
      type: 'Text',
      description:
        '所有节点的标识字段值在整个树范围内不能重复。不填时会根据节点位置生成唯一标识，存储在key属性中。',
      options: {
        placeholder: '节点的唯一标识，默认值为 key'
      },
      value: {
        get({ data }) {
          return data.keyFieldName || 'key';
        },
        set({data}, value: string) {
          data.keyFieldName = value;
        }
      }
    },
    {
      title: '子节点字段',
      type: 'Text',
      options: {
        placeholder: '默认值为 children'
      },
      value: {
        get({ data }) {
          return data.childrenFieldName || 'children';
        },
        set({ data }, value: string) {
          data.childrenFieldName = value;
        }
      }
    },
  ],
};