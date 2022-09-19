import { InputIds, OutputIds } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const BaseEditor = [
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
        output.setTitle(item.key, `单击${item.text}`);
        output.setTitle(`${OutputIds.DoubleClick}_${item.key}`, `双击${item.text}`);
        input.setTitle(`${InputIds.SetBtnText}_${item.key}`, `设置${item.text}名称`);
        input.setTitle(`${InputIds.SetDisable}_${item.key}`, `禁用${item.text}`);
        input.setTitle(`${InputIds.SetEnable}_${item.key}`, `启用${item.text}`);
        input.setTitle(`${InputIds.SetHidden}_${item.key}`, `隐藏${item.text}`);
        input.setTitle(`${InputIds.SetVisible}_${item.key}`, `显示${item.text}`);
      }
    }
  }
];

export default BaseEditor;
