function callCon({env, data, outputs}, params = {}) {
  if (data.connector) {
    try {
      env.callConnector(data.connector, params, data.connectorConfig).then(val => {
        outputs['then'](val)
      }).catch(err => {
        outputs['catch'](err)
      })
    } catch (ex) {
      console.error(ex)

      outputs['catch'](`执行错误 ${ex.message||ex}`)
      //onError(ex.message)
    }
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