const defaultSchema = { type: 'any' };

export default {
  '@init': ({ data, setDesc, setAutoRun, isAutoRun }) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.immediate) {
      setAutoRun(true);
      data.immediate = true;
    }
  },
  ':root': [
    {
      title: 'websocket地址',
      type: 'text',
      options: {
        placeholder: '请输入websocket地址'
      },
      value: {
        get({ data }) {
          return data.wsUrl;
        },
        set({ data, input, output, setDesc }, val) {
          data.wsUrl = val
        }
      }
    }
  ]
};