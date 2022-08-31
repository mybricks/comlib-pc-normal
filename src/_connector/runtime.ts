function callCon({env, data, outputs}, params = {}) {
  if (data.connector) {
    env.callConnector(data.connector, params).then(val => {
      outputs['then'](val)
    }).catch(err => {
      outputs['catch'](err)
    })
  } else {
    outputs['catch'](`没有选择接口`)
  }
}

export default function ({env, data, inputs, outputs}) {
  if (env.runtime) {
    if (data.immediate) {
      callCon({env, data, outputs})
    } else {
      inputs['call'](params => {
        callCon({env, data, outputs}, params)
      })
    }
  }
}