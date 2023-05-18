const def = {
  content: '这是一个文本',
  style: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#000000"
  }
}
export default {
  prompts() {
    return `根据用户需求设计一个文本, 其中包括文本的内容和样式。
    组件定义： ${JSON.stringify(def)}，以下为示例
    请回答： 添加一个文本
    {
      type: 'mybricks.normal-pc.text',
      content: '这是一个文本'}
    `
  },
  '@create'({ def, data }) {
    if (def.content) {
      data.content = def.content
    }

    if (def.style) {
      data.style = { ...data.style, ...def.style }
    }

  },
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
  ":root"({ data }) {

    return {
      prompts: `你是一个出色的文案专家，请根据我的要求修改当前组件
      组件定义： ${JSON.stringify(def)}
      以下是一些例子
      请回答： 添加一个文本
      {
        content: '这是一个文本',
        style: {
          fontWeight: 400,
        }
      }
      `,
      execute({ data, newData, slots }) {
        if (newData.content) {
          data.content = newData.content;
        }
        if (newData.style) {
          data.style = { ...data.style, ...newData.style };
        }
      }
    }
  }
};
