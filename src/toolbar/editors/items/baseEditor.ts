import { InputIds, OutputIds } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const BaseEditor = [
  {
    title: '名称',
    type: 'Text',
    options: {
      locale: true
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.text;
      },
      set({ data, focusArea, input, output, env }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.text = value;
        const text = env.i18n(item.text);
        output.setTitle(item.key, `单击${text}`);
        output.setTitle(`${OutputIds.DoubleClick}_${item.key}`, `双击${text}`);
        input.setTitle(`${InputIds.SetBtnText}_${item.key}`, `设置${text}名称`);
        input.setTitle(`${InputIds.SetDisable}_${item.key}`, `禁用${text}`);
        input.setTitle(`${InputIds.SetEnable}_${item.key}`, `启用${text}`);
        input.setTitle(`${InputIds.SetHidden}_${item.key}`, `隐藏${text}`);
        input.setTitle(`${InputIds.SetVisible}_${item.key}`, `显示${text}`);

        const setTitle = (key: string, title: string) => {
          if (input.get(key)) {
            input.setTitle(key, title);
          }
        };

        const setTitleDone = (key: string, title: string) => {
          if (output.get(key)) {
            output.setTitle(key, title);
          }
        };

        if (item.useDynamicLoading) {
          const eventOpenKey = `${InputIds.SetBtnOpenLoading}_${item.key}`;
          const eventCloseKey = `${InputIds.SetBtnCloseLoading}_${item.key}`;

          const eventOpenDoneKey = `${OutputIds.SetBtnOpenLoadingDone}_${item.key}`;
          const eventCloseDoneKey = `${OutputIds.SetBtnCloseLoadingDone}_${item.key}`;

          setTitle(eventOpenKey, `开启${text}loading`);
          setTitle(eventCloseKey, `关闭${text}loading`);

          setTitleDone(eventOpenDoneKey, `开启${text}loading完成`);
          setTitleDone(eventCloseDoneKey, `关闭${text}loading完成`);
        }
        if (item.useDynamicText) {
          const eventKey = `${InputIds.SetBtnText}_${item.key}`;
          const eventDoneKey = `${OutputIds.SetBtnTextDone}_${item.key}`;

          setTitle(eventKey, `设置${text}名称`);
          setTitleDone(eventDoneKey, `设置${text}名称完成`);
        }
        if (item.useDynamicStyle) {
          const eventKey = `${InputIds.SetBtnStyle}_${item.key}`;
          const eventDoneKey = `${OutputIds.SetBtnStyleDone}_${item.key}`;

          setTitle(eventKey, `设置${text}样式`);
          setTitleDone(eventDoneKey, `设置${text}样式完成`);
        }
        if (item.useDynamicDisabled) {
          const eventKey1 = `${InputIds.SetEnable}_${item.key}`;
          const eventKey2 = `${InputIds.SetDisable}_${item.key}`;

          const eventDoneKey1 = `${OutputIds.SetEnableDone}_${item.key}`;
          const eventDoneKey2 = `${OutputIds.SetDisableDone}_${item.key}`;

          setTitle(eventKey1, `启用${text}`);
          setTitle(eventKey2, `禁用${text}`);

          setTitleDone(eventDoneKey1, `启用${text}完成`);
          setTitleDone(eventDoneKey2, `禁用${text}完成`);
        }
      }
    }
  }
];

export default BaseEditor;
