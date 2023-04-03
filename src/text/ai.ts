export default {
  '@focus'({ data }) {
    return {
      data,
      prompts: `
      以下是一些例子：
      Q：修改当前内容为ABC;
      A：{content: 'ABC'}
      Q：点击后输出 ZYX
      A：{outputContent: ZYX }
      `
    };
  },
  '@update'({ data, newData }) {
    if (typeof newData.content === 'string') {
      data.content = newData.content;
    }

    if (newData.style) {
      data.style = { ...data.style, ...newData.style };
    }
  }
};
