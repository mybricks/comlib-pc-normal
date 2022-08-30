import { Data } from "../../../types";
import { getColumnItem } from "../../../utils";
import { runScript } from "../../../../utils/runExpCodeScript";

interface Props {
  data: Data;
}
const SwitchItemEditor = (props: Props) => {
    const {
        data,
    } = props;
  // 提示项
  const res = [];
  data.columns.forEach((col) => {
    if (!res.find((item) => col.dataIndex === item.label)) {
      res.push({
        label: col.dataIndex,
        insertText: `{${col.dataIndex}}` + ' === ',
        detail: `当前行${col.dataIndex}值`
      });
    }
  });
  //
  const run = (script: string) => {
    return runScript(script, {});
  };
  return {
    title: '开关列设置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType === 'switch';
    },
    items: [
      {
        title: '状态',
        description: `控制开关状态的表达式（{}, =, <, >, ||, &&）, 例：{status} === 1`,
        type: 'EXPRESSION',
        options: {
          autoSize: true,
          placeholder: '例：{status} === 1',
          suggestions: res,
          runCode: run
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const switchCfg = getColumnItem(data, focusArea)?.switchConfig;
            return switchCfg?.checkedScript;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const switchCfg = getColumnItem(data, focusArea)?.switchConfig;
            switchCfg.checkedScript = value;
          }
        }
      },
      {
        title: '大小',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const switchCfg = getColumnItem(data, focusArea)?.switchConfig;
            return switchCfg?.size || 'default';
          },
          set({ data, focusArea }: EditorResult<Data>, value: 'default' | 'small') {
            const switchCfg = getColumnItem(data, focusArea)?.switchConfig;
            switchCfg.size = value;
          }
        }
      },
      {
        title: '点击',
        type: '_Event',
        options: ({ data, focusArea }: EditorResult<Data>) => {
          const switchCfg = getColumnItem(data, focusArea)?.switchConfig;
          return {
            outputId: switchCfg?.id
          };
        }
            },
    ]
  };
}

export default SwitchItemEditor;