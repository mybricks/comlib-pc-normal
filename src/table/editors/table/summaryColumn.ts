import { InputIds, OutputIds } from '../../constants';
import { Data } from '../../types';

const SummaryColumn = [
  {
    title: '总结栏',
    description: '开启后，支持设置总结栏, 双击表格最后一行进行配置',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useSummaryColumn;
      },
      set({ data, inputs, outputs }: EditorResult<Data>, value: boolean) {
        if (value) {
          inputs.add(InputIds.SUMMARY_COLUMN, '设置总结栏数据', { type: 'string' });
          outputs.add(OutputIds.SUMMARY_COLUMN, '总结栏数据', { type: 'string' });
          inputs.get(InputIds.SUMMARY_COLUMN).setRels([OutputIds.SUMMARY_COLUMN]);
        } else {
          inputs.remove(InputIds.SUMMARY_COLUMN);
          outputs.remove(OutputIds.SUMMARY_COLUMN);
        }
        data.useSummaryColumn = value;
      }
    }
  }
];

export default SummaryColumn;
