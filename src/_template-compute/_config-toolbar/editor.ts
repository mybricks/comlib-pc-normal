export default {
  "@init"({ setDesc }) {
    setDesc("未选择组件");
  },
  ":root": [
    {
      title: "选择工具条",
      type: "sceneComSelector",
      value: {
        get({ data }) {
          return data?.toolbar ?? {};
        },
        set({ data, setDesc }, toolbar) {
          data.toolbar = toolbar;
          setDesc(toolbar.title);
        },
      },
    },
  ],
};
