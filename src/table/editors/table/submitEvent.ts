import { uuid } from '../../../utils';
import { Data, SubmitAction } from '../../types';

export const submitEventEditor = [
  {
    title: '提交行为',
    type: 'Array',
    options: {
      draggable: false,
      getTitle: (item: SubmitAction, index: number) => {
        if (!item.title) {
          item.title = `提交行为${index + 1}`;
        }
        return item.title;
      },
      onAdd: () => {
        const actionItem = {
          id: uuid()
        };
        return actionItem;
      },
      items: [
        {
          title: '名称',
          type: 'textarea',
          value: 'title'
        }
      ]
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.submitActions || [];
      },
      set({ data, input, output }: EditorResult<Data>, value: SubmitAction[]) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            const hasInputEvent = input.get(item.id);
            const hasOutputEvent = output.get(item.id);
            if (hasInputEvent) {
              input.setTitle(item.id, item.title);
            } else {
              input.add(item.id, item.title, { type: 'any' });
              input.get(item.id).setRels([item.id]);
            }
            if (hasOutputEvent) {
              output.setTitle(item.id, `${item.title}输出`);
            } else {
              output.add(item.id, `${item.title}输出`, { type: 'any' });
            }
          });
        }
        (data.submitActions || []).forEach(({ id }) => {
          if (!(value || []).some((item) => item.id === id)) {
            input.get(id) && input.remove(id);
            output.get(id) && output.remove(id);
          }
        });
        data.submitActions = value;
      }
    }
  }
];
