import { formItemPropsSchema } from "./constants";

export default {
  '@init'({ setDesc }) {
    setDesc("未选择组件")
  },
  ':root': [
    {
      title: '选择组件',
      type: 'sceneComSelector',
      options: {
        filter: ({ namespace}) => {
          return namespace === 'amc.normal-h5.form-container'
        }
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          data.comDef = comDef
          // setDesc(comDef.title)
          if(!comDef) {
            setDesc('未选择目标表单容器')
          }else {
            setDesc(comDef.label || comDef.comTitle)
          }
        }
      }
    }
  ]
}