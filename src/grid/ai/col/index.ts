import { actions, ACTION_TYPE } from './actions';
import { isObject } from '../../../utils/types';
export default {
  '[data-type-col]'() {
    return {
      prompts: `
        以下是一些例子（最终回答不需要带上“答：”字）：
        问：添加文本和按钮
        答：{${JSON.stringify(ACTION_TYPE.COM)}: ["mybricks.normal-pc.text", "mybricks.normal-pc.button"]}
        问：添加一列
        答：{${JSON.stringify(ACTION_TYPE.COL)}: [{widthOption: 'span', span: 8}]}
        问：左对齐
        答：{${JSON.stringify(ACTION_TYPE.SLOTSTYLE)}: {alignItems: "flex-start"}}
        问：顶部对齐
        答：{${JSON.stringify(ACTION_TYPE.SLOTSTYLE)}: {justifyContent: "flex-start"}}
        问：水平居中
        答：{${JSON.stringify(ACTION_TYPE.SLOTSTYLE)}: {alignItems: "center"}}
        问：内间距12
        答：{${JSON.stringify(ACTION_TYPE.COLSTYLE)}: {padding: 12}}
        问：左对齐，背景红色
        答：{${JSON.stringify(ACTION_TYPE.SLOTSTYLE)}: {alignItems: "flex-start"}, ${JSON.stringify(ACTION_TYPE.COLSTYLE)}: {backgroundColor: "red"}}
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
            //样式兜底
            actions[ACTION_TYPE.COLSTYLE](props);
          }
        } catch (error) {
          throw Error(`【chatGPT回答数据解析失败】：${error}`);
        }
      }
    };
  }
};
