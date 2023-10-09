import { InputIds } from '../../constants';
import { Data } from '../../types';

const SummaryColumnEditor = {
  '.ant-table-summary': {
    title: '总结栏',
    items: (_, ...cateAry) => {
      cateAry[0].title = '常规';
      cateAry[0].items = [
        {
          title: '标题内容',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.summaryColumnTitle;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.summaryColumnTitle = value;
            }
          }
        },
        {
          title: '标题列数',
          type: 'inputnumber',
          description: '标题占据的列数，内容占据剩余所有列',
          options: [{ min: 0, max: 1000, width: 100 }],
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.summaryCellTitleCol];
            },
            set({ data }: EditorResult<Data>, value: number[]) {
              data.summaryCellTitleCol = value[0];
            }
          }
        },
        {
          title: '内容类型',
          type: 'Select',
          options: [
            { label: '普通文字', value: 'text' },
            { label: '自定义插槽', value: 'slotItem' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.summaryColumnContentType;
            },
            set({ data, slot }: EditorResult<Data>, value: 'text' | 'slotItem') {
              const hasEvent = slot.get('summaryColumn');
              if (value === 'slotItem') {
                if (!hasEvent) {
                  slot.add({
                    id: 'summaryColumn',
                    title: `自定义总结栏内容`,
                    type: 'scope'
                  });
                }
              } else {
                hasEvent && slot.remove('summaryColumn');
              }
              data.summaryColumnContentType = value;
            }
          }
        },
        {
          title: '内容数据类型',
          type: '_schema',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.summaryColumnContentSchema;
            },
            set({ data, input }: EditorResult<Data>, value: object) {
              data.summaryColumnContentSchema = value;
              input.get(InputIds.SUMMARY_COLUMN)?.setSchema(value);
            }
          }
        }
      ];
    },
    style: [
      {
        title: '标题',
        options: ['font'],
        initValue: {
          textAlign: 'center'
        },
        target: '.summaryCellTitle'
      },
      {
        title: '内容',
        options: ['font'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.summaryColumnContentType === 'text';
        },
        initValue: {
          textAlign: 'center'
        },
        target: '.summaryCellContent'
      },
      {
        title: 'Hover',
        initValue: {
          background: '#f5f7f9'
        },
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: 'tfoot.ant-table-summary>.summaryRow:hover'
      }
    ]
  }
};

export default SummaryColumnEditor;
