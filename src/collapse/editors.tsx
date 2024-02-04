import { Data, InputIds, OutputIds, Schemas, SlotIds } from './constants';
import { Editor, EditorType } from '../utils/editor';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': ({}, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [
      Editor<Data>('标题', EditorType.Text, 'title', { options: { locale: true } }),
      {
        title: '开启自定义标题',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustomTitle || false;
          },
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            data.isCustomTitle = value;
            if (data.isCustomTitle === true) {
              slot.add(SlotIds.Title, '标题容器');
            } else {
              slot.remove(SlotIds.Title, '标题容器');
            }
          }
        }
      },
      Editor<Data>('默认展开', EditorType.Switch, 'expanded'),
      Editor<Data>('额外操作', EditorType.Switch, 'useExtra', {
        description: '自定义渲染面板右上角的内容',
        value: {
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            const hasSlot = slot.get(SlotIds.Extra);
            if (value) {
              !hasSlot && slot.add(SlotIds.Extra, '额外操作');
            } else {
              hasSlot && slot.remove(SlotIds.Extra);
            }
            data.useExtra = value;
          }
        }
      })
    ];

    cate2.title = '事件';
    cate2.items = [
      Editor<Data>('动态标题', EditorType.Switch, 'useDynamicTitle', {
        value: {
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = input.get(InputIds.Title);
            if (value) {
              !hasEvent && input.add(InputIds.Title, '标题', Schemas.Title);
              !output.get('setTitleDone') &&
                output.add('setTitleDone', '设置标题完成', Schemas.Title);
              input.get(InputIds.Title).setRels(['setTitleDone']);
            } else {
              hasEvent && input.remove(InputIds.Title);
              output.get('setTitleDone') && output.remove('setTitleDone');
            }
            data.useDynamicTitle = value;
          }
        }
      }),
      Editor<Data>('动态展开收起', EditorType.Switch, 'useDynamicExpand', {
        value: {
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            const hasExpandedEvent = input.get(InputIds.Expanded);
            const hasFoldedEvent = input.get(InputIds.Folded);
            const hasExpandedChangeEvent = output.get(OutputIds.ExpandedChange);

            if (value) {
              !hasExpandedEvent && input.add(InputIds.Expanded, '展开', Schemas.Expanded);
              !hasFoldedEvent && input.add(InputIds.Folded, '收起', Schemas.Folded);

              !output.get('seExpandedDone') &&
                output.add('seExpandedDone', '设置展开完成', Schemas.Expanded);
              !output.get('setFoldedDone') &&
                output.add('setFoldedDone', '设置收起完成', Schemas.Folded);

              input.get(InputIds.Expanded).setRels(['seExpandedDone']);
              input.get(InputIds.Folded).setRels(['setFoldedDone']);

              !hasExpandedChangeEvent &&
                output.add(OutputIds.ExpandedChange, '展开收起事件', Schemas.ExpandedChange);
            } else {
              hasExpandedEvent && input.remove(InputIds.Expanded);
              hasFoldedEvent && input.remove(InputIds.Folded);
              hasExpandedChangeEvent && output.remove(OutputIds.ExpandedChange);

              output.get('seExpandedDone') && output.remove('seExpandedDone');
              output.get('setFoldedDone') && output.remove('setFoldedDone');
            }
            data.useDynamicExpand = value;
          }
        }
      }),
      Editor<Data>('展开收起事件', EditorType.Event, null, {
        ifVisible({ data, output }) {
          return !!(data.useDynamicExpand && output.get(OutputIds.ExpandedChange));
        },
        options: {
          outputId: OutputIds.ExpandedChange
        }
      })
    ];
  }
};
