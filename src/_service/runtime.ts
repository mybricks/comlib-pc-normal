export default function ({env, inputs, outputs}) {
  inputs['call'](params => {
    env.callConnector(params).then(val => {
      outputs['then'](val)
    }).catch(err => {
      outputs['catch'](err)
    })
  })
}