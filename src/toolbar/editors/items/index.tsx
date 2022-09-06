import { getBtnItemInfo } from '../../utils';
import { BtnItemDataSetKey, InputIds } from '../../constants';
import { Data } from '../../types';
import IndexEditor from './indexEditor';
import DynamicEventEditor from './dynamicEventEditor';
import IconEditor from './iconEditor';
import PermissionEditor from './permissionEditor';
import StyleEditor from './styleEditor';

const itemEditor = {
  [`[${BtnItemDataSetKey}]`]: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.text;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.text = value.trim();
            output.setTitle(item.key, item.text);
            input.setTitle(`${InputIds.SetOutputVal}_${item.key}`, `设置${item.text}输出内容`);
            input.setTitle(`${InputIds.SetDisable}_${item.key}`, `禁用${item.text}`);
            input.setTitle(`${InputIds.SetEnable}_${item.key}`, `启用${item.text}`);
            input.setTitle(`${InputIds.SetHidden}_${item.key}`, `隐藏${item.text}`);
            input.setTitle(`${InputIds.SetVisible}_${item.key}`, `显示${item.text}`);
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              const { item } = getBtnItemInfo(data, focusArea);
              return {
                outputId: item.key
              };
            }
          }
        ]
      },
      ...IndexEditor
    ];

    cate2.title = '样式';
    cate2.items = [...StyleEditor, ...IconEditor];

    cate3.title = '高级';
    cate3.items = [...DynamicEventEditor, ...PermissionEditor];

    return {
      title: '按钮'
    };
  }
};

export default itemEditor;
