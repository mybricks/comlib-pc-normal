import { Data } from './types';
export default {
  ':root'({ input,data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '标题行序号',
        type: 'inputNumber',
        description: '一般为第一行;设置为0,表示没有标题行',
        options: [{ min: 0, max: 4 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.titleIndex];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.titleIndex = value[0];
          }
        }
      },
      {
        title: 'excel字段行序号',
        description: '如果有表示字段行,可以填写,会输出字段数组;0表示没有字段行',
        type: 'inputNumber',
        options: [{ min: 0}],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.fieldIndex];
          },
          set({ data }: EditorResult<Data>, val: number[]) {
            data.fieldIndex = val[0];
          }
        }
      },
      {
        title: '时间格式类型',
        type: 'select',
        options: [
          { label: 'yyyy-mm-dd', value: 'yyyy-mm-dd' },
          { label: 'mm/dd/yyyy', value: 'mm"/"dd"/"yyyy' },
        ],
        value: {
          get({ data }) {
            return data.dateNF || `yyyy-mm-dd`;
          },
          set({ data }, value: string) {
            data.dateNF = value;
          }
        }
      },
    ];
  }
};
