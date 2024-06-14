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
        filter:({namespace}) => {
          return namespace === 'mybricks.normal-pc.table'
        }
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          data.comDef = comDef
          setDesc(comDef.title)
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
    },
    {
      title: "分页配置",
      type: "switch",
      description: "开关开启后，增加对应分页配置",
      value: {
        get({ data }) {
          return data.isPagination || false;
        },
        set({ data, setDesc, input }, value: boolean) {
          data.isPagination = value;
          if(value){
            input.add("setPagination","设置分页",{
              type: "object",
              properties: {
                total: {
                  type: "number",
                },
                current: {
                  type: "number"
                },
                defaultPageSize: {
                  type: "number"
                }
              }
            })
          }else{
            input.remove("setPagination")
          }
        },
      }
    },
  ],
};
