import omit from 'lodash/omit'
export default function ({ env, data, inputs, outputs, onError }) {

  const next = !!env.runtime // !env.runtime.debug // !env.runtime.debug // !env.runtime.debug //  
  inputs['store']((store) => {

    if (next) {

      /**
       * data 数据源
       * append 添加组件
       *  - slotId 向该插槽添加组件
       *  - namesapce 组件命名空间
       *  - data 组件数据源
       */
      const { data: mayBeListData } = store

      let comForm
      try {
        comForm = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })

      } catch (error) {
      }

      // TODO: 表单配置字段、表单namespace字段
      const formItems = Array.isArray(mayBeListData) ? mayBeListData : [mayBeListData]
      // if(formItems.some(ite => !ite.namespace)) {
      //   onError("组件namespace必填");
      //   return
      // }
      const newItems = formItems.map((item) => {
        let comItem
        try {
          // 给表单容器的插槽添加组件，同时返回当前组件的信息
          comItem = comForm.slots[0].appendChild({
            namespace: item.namespace || 'mybricks.normal-pc.form-text',
            data: {... omit(item, ['namespace']), ...(item.disabled !== undefined ? { config: { disabled: item.disabled}} : {})}
          })

        } catch (error) {
        }
        return {
          ...comItem,
          id: comItem?.id,
          props: {
            // label: item.label,
            // name: item.field,
            disabled: item.disabled,
          }
        }
      })
      // 修改模板页面中的表单数据， TODO：是否追加到form items里面，还是直接替换拿不到添加
      comForm.data.items = comForm.data.items.map((formItem) => {
        const configItem = newItems.find((item) => item.id === formItem.id)
        return {
          ...formItem,
          ...configItem?.data,
        } 
      })
      outputs['finish']()
    }
  })
}
