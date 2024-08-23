import { InputIds, OutputIds, Schemas } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const DynamicEventEditor = [
  {
    title: '动态显示/隐藏',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);
        return item.useDynamicHidden;
      },
      set({ data, focusArea, input,output, env }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);
        const eventKey1 = `${InputIds.SetVisible}_${item.key}`;
        const eventKey2 = `${InputIds.SetHidden}_${item.key}`;

        const event1 = input.get(eventKey1);
        const event2 = input.get(eventKey2);
        const text = env.i18n(item.text);
        if (value) {
          if (!event1) {
            input.add(eventKey1, `显示${text}`, Schemas.Any);
            output.add(`${OutputIds.SetHiddenDone}_${item.key}`, '完成', { type: 'any' });
            input.get(eventKey1).setRels([`${OutputIds.SetHiddenDone}_${item.key}`]);
          }
          if (!event2) {
            input.add(eventKey2, `隐藏${text}`, Schemas.Any);
            output.add(`${OutputIds.SetVisibleDone}_${item.key}`, '完成', { type: 'any' });
            input.get(eventKey2).setRels([`${OutputIds.SetVisibleDone}_${item.key}`]);
          }
        } else {
          if (event1) {
            input.remove(eventKey1);
            output.remove(`${OutputIds.SetHiddenDone}_${item.key}`);
          }
          if (event2) {
            input.remove(eventKey2);
            output.remove(`${OutputIds.SetVisibleDone}_${item.key}`);
          }
        }
        item.useDynamicHidden = value;
      }
    }
  },
  {
    title: '默认显示/隐藏',
    type: 'Switch',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);
      return !!item.useDynamicHidden;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);
        return typeof item.hidden !== 'undefined' ? !item.hidden : true;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);
        item.hidden = !value;
      }
    }
  }
];

export default DynamicEventEditor;
