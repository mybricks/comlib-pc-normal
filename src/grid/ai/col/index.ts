import { actions, ACTION_TYPE } from './actions';
export default {
  '[data-type-col]'() {
    return {
      def: {
        slotStyle: { flexDirection: 'column' }
      },
      prompts: `
        以下是一些例子（最终回答不需要带上“答：”字）：
        问：添加文本
        答：{type: ${JSON.stringify(
          ACTION_TYPE.ADD_COM
        )}, data: { namespace: "mybricks.normal-pc.text"}}
        问：添加一列
        答：{type: ${JSON.stringify(ACTION_TYPE.ADD_COL)}, data: {widthOption: 'span', span: 8}}
        问：左对齐
        答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {slotStyle: {alignItems: "flex-start"}}}
        问：顶部对齐
        答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {slotStyle: {justifyContent: "flex-start"}}}
        问：水平居中
        答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {slotStyle: {alignItems: "center"}}}
        问：内间距12
        答：{type: ${JSON.stringify(ACTION_TYPE.STYLE)}, data: {colStyle: {padding: 12}}}
        `,
      execute(props) {
        const { newData } = props;
        if (newData.type && newData.type in actions) {
          actions[newData.type](props);
        }
      }
    };
  }
};
