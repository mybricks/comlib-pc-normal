import { actions, ACTION_TYPE } from './actions';
export default {
  '[data-type-row]'() {
    return {
      prompts: `
            以下是一些例子（最终回答不需要带上“答：”字）：
            问：添加一行
            答：{type: ${JSON.stringify(ACTION_TYPE.ADD_ROW)}, data: [
                {key: "column_0", widthOption: 'px', span: 300, slot: "slot_0"},
                {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1"}, 
                {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
            ]}
            问：左对齐
            答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {justify: "start"}
            问：垂直居中
            答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {align: "middle"}
            问：底部对齐
            答：{type: ${JSON.stringify(ACTION_TYPE.LAYOUT)}, data: {align: "bottom"}
            问：背景色
            答：{type: ${JSON.stringify(ACTION_TYPE.STYLE)}, data: {backgroundColor: "red"}
            问：第一列添加文本
            答：{type: "addCom", data: { key: "column_0", slot: "slot_0", namespace: "mybricks.normal-pc.text"}}
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
