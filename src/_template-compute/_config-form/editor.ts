export default {
  "@init"({ setDesc }) {
    setDesc("未选择组件");
  },
  ":root": [
    {
      title: "选择表单",
      type: "sceneComSelector",
      value: {
        get({ data }) {
          return data.form ?? "";
        },
        set({ data, setDesc }, form) {
          data.form = form;
          setDesc(form.title);
        },
      },
    },
  ],
};
