export default {
  "@init"({ setDesc }) {
    setDesc("未选择组件");
  },
  ":root": [
    {
      title: '选择组件',
      type: 'sceneComSelector',
      options: {
        filter:({namespace}) => {
          return namespace === 'amc.normal-h5.toolbar'
        }
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          data.comDef = comDef
          setDesc(comDef.label)
        }
      }
    },
    {
      title: '工具条操作',
      type: 'Select',
      description: '默认整体设置工具条数据，可以切换为在工具条前或后添加子项',
      options: [
        { label: '整体设置', value: 'setData' },
        { label: '整体前添加', value: 'addBefore' },
        { label: '整体后添加', value: 'addAfter' },
      ],
      value: {
        get({ data }) {
          return data?.operationType || 'setData';
        },
        set({ data, input }, value: 'setData' | 'addBefore' | 'addAfter') {
          data.operationType = value;
        }
      }
    },
  ],
};
