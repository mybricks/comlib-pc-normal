export default {
  '@init'({ data, setDesc, setAutoRun, isAutoRun }) {
    setDesc('多图组件');
  },
  ':root'({ data }) {
    return {
      prompts: `
你可以帮助用户配置多图组件，包括：
1. 设置图片列表（支持图片地址、描述、预览地址）
2. 选择布局方式（网格或列表）
3. 配置网格列数、图片间距
4. 设置填充模式（fill/contain/cover/none）
5. 开启或关闭预览功能
6. 配置容错处理和禁止右键/拖拽功能
`
    };
  }
};
