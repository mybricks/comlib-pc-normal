import { Editor, EditorType } from '../utils/editor';
import { Data, OUTPUTS, SLOTS, DateSchema, MonthSchema } from './constants';

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
          outputId: OUTPUTS.ClickDate,
          schema: DateSchema
        }
      }),
      Editor<Data>('点击月份', EditorType.EventSwitch, 'useClickMonthEvent', {
        options: {
          outputId: OUTPUTS.ClickMonth,
          schema: MonthSchema
        }
      }),
      Editor<Data>('日期变化', EditorType.EventSwitch, 'useDateChangeEvent', {
        options: {
          outputId: OUTPUTS.DateChange,
          schema: DateSchema
        }
      }),
      Editor<Data>('月份变化', EditorType.EventSwitch, 'useMonthChangeEvent', {
        options: {
          outputId: OUTPUTS.MonthChange,
          schema: MonthSchema
        }
      }),
      Editor<Data>(
        '年/月面板切换',
        EditorType.EventSwitch,
        'useModeChangeEvent',
        {
          options: {
            outputId: OUTPUTS.ModeChange,
            schema: MonthSchema
          }
        }
      )
    ];

    cate3.title = '高级';
    cate3.items = [
      Editor<Data>('日期内容插槽', EditorType.Switch, 'useCustomDateCell', {
        value: {
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            if (value) {
              slot.add(SLOTS.DateCell, '日期内容插槽');
            } else {
              slot.remove(SLOTS.DateCell);
            }
            data.useCustomDateCell = value;
          }
        }
      }),
      Editor<Data>('顶部插槽', EditorType.Switch, 'useCustomHeader', {
        value: {
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            if (value) {
              slot.add(SLOTS.HeaderRender, '顶部插槽');
            } else {
              slot.remove(SLOTS.HeaderRender);
            }
            data.useCustomHeader = value;
          }
        }
      })
    ];

    return { title: '日历' };
  }
};
