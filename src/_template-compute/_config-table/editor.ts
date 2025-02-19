import { filter } from "lodash";

export default {
  // "@init"({ setDesc }) {
  //   setDesc("未选择组件");
  // },
  ":root": [
    {
      title: '选择组件',
      type: 'sceneComSelector',
      options: {
        filter: ({ namespace }) => {
          return namespace === 'amc.normal-h5.table'
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
    // {
    //   title: "列配置",
    //   type: "switch",
    //   description: "开关开启后，增加对应列配置",
    //   value: {
    //     get({ data }) {
    //       return data.isEditable || true;
    //     },
    //     set({ data, setDesc, input }, value: boolean) {
    //       data.isEditable = value;
    //     },
    //   }
    // },
    {
      title: '列操作',
      type: 'Select',
      options: [
        { label: '设置列', value: 'setColumn' },
        { label: '列前添加列', value: 'addBeforeColumn' },
        { label: '列后添加列', value: 'addAfterColumn' },
      ],
      value: {
        get({ data }) {
          return data?.operationType || 'setColumn';
        },
        set({ data, input }, value: 'setColumn' | 'addBeforeColumn' | 'addAfterColumn') {
          data.operationType = value;
        }
      }
    }
  ],
};
