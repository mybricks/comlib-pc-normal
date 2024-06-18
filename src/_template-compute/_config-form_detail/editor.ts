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
          return namespace === 'mybricks.normal-pc.form-detail'
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
      title: '描述列表标题',
      type: 'text',
      options: {
        locale: true
      },
      ifVisible({ data }) {
        return !!data.showTitle;
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
      title: '显示标题',
      type: 'Switch',
      value: {
        get({ data }) {
          return data.showTitle;
        },
        set({ data }, value: boolean) {
          data.showTitle = value;
        }
      }
    },
  ],
};