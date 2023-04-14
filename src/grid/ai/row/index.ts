import { actions, ACTION_TYPE } from './actions';
import { isObject } from '../../../utils/types';
export default {
  '[data-type-row]'() {
    return {
      prompts: `
            以下是一些例子（最终回答不需要带上“答：”字）：
            问：添加一行
            答：{${JSON.stringify(ACTION_TYPE.ADD_ROW)}: [
                {key: "column_0", widthOption: 'px', span: 300, slot: "slot_0"},
                {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1"}, 
                {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
            ]}
            问：左对齐
            答：{${JSON.stringify(ACTION_TYPE.LAYOUT)}: {justify: "start"}}
            问：垂直居中
            答：{${JSON.stringify(ACTION_TYPE.LAYOUT)}: {align: "middle"}}
            问：底部对齐
            答：{${JSON.stringify(ACTION_TYPE.LAYOUT)}: {align: "bottom"}}
            问：背景色
            答：{${JSON.stringify(ACTION_TYPE.STYLE)}: {backgroundColor: "red"}}
            问：第一列添加文本和按钮
            答：{${JSON.stringify(
              ACTION_TYPE.ADD_COM
            )}: [{ key: "column_0", slot: "slot_0", coms: ["mybricks.normal-pc.text", "mybricks.normal-pc.button"]}]}
            `,
      execute(props) {
        try {
          const { newData } = props;
          if (isObject(newData)) {
            Object.keys(newData).forEach((key) => {
              if (key in actions) {
                actions[key](props);
              }
            });
          }
        } catch (error) {
          throw Error(`【chatGPT回答数据解析失败】：${error}`);
        }
      }
    };
  }
};
