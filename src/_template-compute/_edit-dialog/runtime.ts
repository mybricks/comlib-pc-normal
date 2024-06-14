import { merge } from "lodash"
import { uuid } from "../utils"

export interface Data {
  title?: string
  hideTitle: boolean
  comDef: any
  comList?: Array<Record<string, any>>
  useStaticData: boolean
  useFooter: boolean
  actionOptions: Array<{id: string, label: string, value: any, visible: boolean }>
}
export default function ({ env, data, inputs, outputs, onError }: { env: any,  onError: any, data: Data, inputs: any, outputs: any}) {

  const next =  !env.runtime.debug // !env.runtime.debug // !env.runtime.debug // !env.runtime.debug // !env.runtime.debug //  
  inputs['store']((store) => {
    console.log('store', store, store.comDef, data)
    if (next) {

      /**
       * data 数据源
       */
      const { formData } = store

      let comForm
      try {
       comForm = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      } catch (error) {
      }
      console.log('comForm', comForm, data)
      let newItems = []
      if(formData) {
        const slot = comForm.slots.find(({ id }) => id === "body");
        formData.forEach(item => {
          let comItem = slot.appendChild({
            namespace: item.namespace || 'mybricks.normal-pc.form-text',
          })
          console.log('comItem', comItem, item)
        })
      }
      const { title, hideTitle, actionOptions = [], useFooter, comList, useStaticData = false  } = data
      if(!formData && useStaticData && comList?.length) {
        const slot = comForm.slots.find(({ id }) => id === "body");
        comList.forEach(item => {
          let comItem = slot.appendChild({
            namespace: item.namespace || 'mybricks.normal-pc.form-text',
          })
        })
      }
      actionOptions.filter(i => i.visible).forEach(btn => {
        const defaultBtn = {
          title: btn.label,
          id: uuid(),
          icon: "",
          useIcon: false,
          showText: true,
          dynamicHidden: true,
          dynamicDisabled: true,
          type: "default",
          visible: true,
          autoClose: true,
          isConnected: false,
          disabled: false,
          useDynamicDisabled: false,
          useDynamicHidden: false
        };
        comForm.data.footerBtns.push(defaultBtn)

      })

      // 修改模板页面中的对话框数据
      comForm.data = merge(comForm.data, { title, hideTitle, actionOptions, useFooter })
      console.log('finish --- ', newItems)
      outputs['finish']()
    }
  })
}
