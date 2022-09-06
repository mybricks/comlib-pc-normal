import { Editor, EditorType } from '../utils/editor';
import { Data, OutputIds, SlotIds, Schemas, InputIds } from './constants';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      Editor<Data>('默认展示模式', EditorType.Select, 'mode', {
        options: [
          {
            label: '按月展示',
            value: 'month'
          },
          {
            label: '按年展示',
            value: 'year'
          }
        ]
      }),
      Editor<Data>('年/月模式切换', EditorType.Switch, 'useModeSwitch'),
      Editor<Data>('月份切换', EditorType.Switch, 'useMonthSelect'),
      Editor<Data>('年份切换', EditorType.Switch, 'useYearSelect')
    ];

    cate2.title = '事件';
    cate2.items = [
      Editor<Data>('点击日期', EditorType.EventSwitch, 'useClickDateEvent', {
        options: {
          outputId: OutputIds.ClickDate,
          schema: Schemas.DateSchema
        }
      }),
      Editor<Data>('点击月份', EditorType.EventSwitch, 'useClickMonthEvent', {
        options: {
          outputId: OutputIds.ClickMonth,
          schema: Schemas.MonthSchema
        }
      }),
      Editor<Data>('日期变化', EditorType.EventSwitch, 'useDateChangeEvent', {
        options: {
          outputId: OutputIds.DateChange,
          schema: Schemas.DateSchema
        }
      }),
      Editor<Data>('月份变化', EditorType.EventSwitch, 'useMonthChangeEvent', {
        options: {
          outputId: OutputIds.MonthChange,
          schema: Schemas.MonthSchema
        }
      }),
      Editor<Data>('年/月面板切换', EditorType.EventSwitch, 'useModeChangeEvent', {
        options: {
          outputId: OutputIds.ModeChange,
          schema: Schemas.MonthSchema
        }
      })
    ];

    cate3.title = '高级';
    cate3.items = [
      Editor<Data>('日期内容插槽', EditorType.Switch, 'useCustomDateCell', {
        value: {
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            if (value) {
              slot.add({ id: SlotIds.DateCell, title: '日期内容插槽', type: 'scope' });
              slot
                .get(SlotIds.DateCell)
                .inputs.add(InputIds.CurrentDate, '当前日期', Schemas.String);
              slot
                .get(SlotIds.DateCell)
                .inputs.add(InputIds.CurrentDs, '当前数据', Schemas.CurrentDs);
            } else {
              slot.remove(SlotIds.DateCell);
            }
            data.useCustomDateCell = value;
          }
        }
      })
    ];

    return { title: '日历' };
  }
};
