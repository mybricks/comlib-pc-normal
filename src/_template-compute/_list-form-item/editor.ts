import { originformItemList } from "./const";


export default {
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
  },
  ":root": [
    {
      title: "勾选需要的表单项",
      type: "select",
      options: {
        mode: 'multiple',
        get options() {
          return originformItemList.map(item => ({
            label: item.title,
            value: item.namespace
          }))
        },

      },
      value: {
        get({ data }) {
          return data.formItemList || [];
        },
        set({ data, setDesc }, val) {
          data.formItemList = val;
        },
      },
    },
  ],
};
