function callCon({env, data, outputs}) {
  if (data.connector) {
    env.callConnector(data.connector, data.params).then(val => {
      outputs['then'](val)
    }).catch(err => {
      outputs['catch'](err)
    })
  } else {
    outputs['catch'](`没有配置连接器.`)
  }
}

export default function ({env, data, inputs, outputs}) {
  if (env.runtime) {
    if (data.immediate) {
      callCon({env, data, outputs})
    } else {
      inputs['call'](opts => {
        callCon({env, data, outputs}, opts)
      })
    }
  }
}