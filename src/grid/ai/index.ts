import RowAi from './row';
import ColAi from './col';
export default {
  ':root'({ data }) {
    return {
      prompts: `
            例如：
            问：2列布局
            答：{type: 'mybricks.normal-pc.grid', columns: [
                    {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1"}, 
                    {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
                ]
            }
            问：栅格第一列包含文本组件
            答：{type: 'mybricks.normal-pc.grid', columns: [{widthOption: 'px', width: 280, slots: {content: []}}]}
        `,
      execute({ data, newData, slots }) {
        console.log(newData)
      }
    };
  },
  ...RowAi,
  ...ColAi
};
