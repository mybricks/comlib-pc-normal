import css from './Form.less'

import {useComputed} from "@mybricks/rxui";
import {Button, Form} from 'antd';
import getFormItem from "./items";

export default function ({env, data, inputs, outputs}: T_ComArgs) {
  const [form] = Form.useForm();

  inputs['init'](data=>{
    form.setFieldsValue(data)
  })

  inputs['submit'](() => {
    form.validateFields().then(values => {
      onFinish(values)
    }).catch(err => {
      outputs['validateError'](err)
    })
  })

  const onFinish = values => {
    outputs['submitTo'](values)
  }

  const onFinishFailed = errorInfo => {
    outputs['validateError'](errorInfo)
  }

  const formJSX = useComputed(() => {
    const rtn = []
    if (data.formItems) {
      if (data.formItemsCfg.layout === 'column') {
        return (
          <Form
            form={form}
            name="basic"
            wrapperCol={{flex: 1}}
            labelCol={{flex: `0 0 ${data.labelWidth}px`}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            {
              data.formItems.map(item => {
                return getFormItem(item, data)
              })
            }
            <Form.Item
              // wrapperCol={{flex: 1}}
              // labelCol={{flex: `0 0 ${data.labelWidth}px`}}
              style={{display: !data.buttons.display ? 'none' : '', marginLeft: data.labelWidth}}>
              <section data-btns-type='submit'>
                <Button type="primary" htmlType="submit">
                  {data.buttons.submit.title}
                </Button>
              </section>
            </Form.Item>
          </Form>
        )
      } else {//layout=row
        return (
          <Form
            form={form}
            name="basic"
            wrapperCol={{flex: 1}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <div className={css.layoutH}>
              <div className={css.items}>
                {
                  data.formItems.map(item => {
                    return getFormItem(item, data)
                  })
                }
              </div>
              <div className={css.btns}
                   data-btns-type='submit'
                   style={{display: !data.buttons.display ? 'none' : ''}}>
                <Button type="primary" htmlType="submit">
                  {data.buttons.submit.title}
                </Button>
              </div>
            </div>
          </Form>
        )
      }
    }
    return rtn
  })

  return (
    <div style={{width: data.width}} className={css.form}>
      {
        data.title.display ? (
          <div className={css.formTitle}>
            {data.title.content}
          </div>
        ) : null
      }
      {formJSX}
    </div>
  );
}