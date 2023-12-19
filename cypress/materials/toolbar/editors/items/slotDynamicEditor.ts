import { InputIds, Schemas } from '../../constants';
import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const DynamicEventEditor = [
  {
    title: '动态显示/隐藏',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.useDynamicHidden;
      },
      set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea, Object.keys(focusArea.dataset)[0]);

        const eventKey1 = `${InputIds.SetVisible}_${item.key}`;
        const eventKey2 = `${InputIds.SetHidden}_${item.key}`;

        const event1 = input.get(eventKey1);
        const event2 = input.get(eventKey2);
        if (value) {
          !event1 && input.add(eventKey1, `显示${item.text}`, Schemas.Any);
          !event2 && input.add(eventKey2, `隐藏${item.text}`, Schemas.Any);
        } else {
          event1 && input.remove(eventKey1);
          event2 && input.remove(eventKey2);
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
