import { Data, InputIds, OutputIds, Schemas, SlotIds } from './constants';
import { Editor, EditorType } from '../utils/editor';

export default {
  ':root': ({}, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [
      Editor<Data>('标题', EditorType.Text, 'title'),
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
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const hasEvent = input.get(InputIds.Title);
            if (value) {
              !hasEvent && input.add(InputIds.Title, '标题', Schemas.Title);
            } else {
              hasEvent && input.remove(InputIds.Title);
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
              !hasExpandedEvent &&
                input.add(InputIds.Expanded, '展开', Schemas.Expanded);
              !hasFoldedEvent &&
                input.add(InputIds.Folded, '收起', Schemas.Folded);

              !hasExpandedChangeEvent &&
                output.add(
                  OutputIds.ExpandedChange,
                  '展开收起事件',
                  Schemas.ExpandedChange
                );
            } else {
              hasExpandedEvent && input.remove(InputIds.Expanded);
              hasFoldedEvent && input.remove(InputIds.Folded);
              hasExpandedChangeEvent && output.remove(OutputIds.ExpandedChange);
            }
            data.useDynamicExpand = value;
          }
        }
      }),
      Editor<Data>('展开收起事件', EditorType.Event, null, {
        ifVisible({ data, output }) {
          return !!(
            data.useDynamicExpand && output.get(OutputIds.ExpandedChange)
          );
        },
        options: {
          outputId: OutputIds.ExpandedChange
        }
      })
    ];
  }
};
