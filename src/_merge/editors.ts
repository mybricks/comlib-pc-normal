interface Data {
  isMerge: boolean;
}

export default {
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ data, input }) {
          const idx = getInputOrder({ data, input });
          const title = `输入项${idx}`;
          const hostId = `input${idx}`;
          input.add(
            hostId,
            title,
            {
              type: 'follow'
            },
            true,
            1
          );
        }
      }
    },
    // {
    //   title: '是否合并',
    //   type: 'switch',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return !!data.isMerge;
    //     },
    //     set({ data }: EditorResult<Data>, val: boolean) {
    //       data.isMerge = val;
    //     }
    //   }
    // }
  ]
};

function getInputOrder({ data, input }) {
  if (data.inputCount === void 0) {
    const c = Object.keys(input.get()).length;
    data.inputCount = c;
  }
  return data.inputCount++;
}
