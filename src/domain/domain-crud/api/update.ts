// import { ajax } from '../util'

export default function updateData(callDomainModel, domainModel, params) {
  return new Promise((resolve, reject) => {
    callDomainModel(domainModel, 'UPDATE', {
      query: {
        ...params
      }
    }).then(r => {
      if (r.code === 1) {
        resolve(r.data)
      } else {
        reject(r.msg || '请求错误，请稍候再试~')
      }
    }).catch(e => {
      console.error(e)
      reject('请求错误，请稍候再试~')
    })
    // ajax({
    //   params: {
    //     query: { ...params },
    //     action: 'UPDATE'
    //   },
    //   serviceId: domainConfig.serviceId,
    //   fileId: domainConfig.fileId,
    //   projectId: domainConfig.projectId
    // }).then(r => {
    //   resolve(r)
    // })
  })

}