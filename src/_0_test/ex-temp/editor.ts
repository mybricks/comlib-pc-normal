interface Data {
    expression: string
}
export default {
  '@init': ({ style, data }) => {},
  '@resize': {
    options: []
  },
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '表达式',
        type: 'expression',
        options() {
            return {
                placeholder: '请输入表达式',
                suggestions: []
            }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.expression;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.expression = val;
          }
        }
      }
    ];
  }
};
