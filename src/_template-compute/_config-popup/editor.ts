export default {
  "@init"({ setDesc }) {
  },
  ":root": [
    {
      title: "选择对话框",
      type: "sceneComSelector",
      options: {
        filter: ({ namespace }) => {
          return namespace === 'mybricks.basic-comlib.popup'
        }
      },
      value: {
        get({ data }) {
          return data.comDef;
        },
        set({ data, setDesc }, val) {
          data.comDef = val
        },
      },
    },
    {
      title: "开启添加组件",
      type: "switch",
      value: {
        get({ data }) {
          return data.enableAddCom || true;
        },
        set({ data, setDesc }, val) {
          data.enableAddCom = val
        },
      },
    },
  ]
};
