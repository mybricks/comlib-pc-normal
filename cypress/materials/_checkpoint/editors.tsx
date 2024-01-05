export default {
  ':root': [
    {
      title: 'ID',
      type: 'text',
      options: {
        placeholder: '请输入 ID'
      },
      value: {
        get({ data }) {
          return data.id;
        },
        set({ data }, value: string) {
          data.id = value;
        }
      }
    },
  ]
};
