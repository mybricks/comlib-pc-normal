// import { ajax } from '../util'

export default function deleteData(callDomainModel, domainModel, params) {

  return new Promise((resolve, reject) => {
    if (callDomainModel) {
      callDomainModel(domainModel, 'DELETE', {
        query: params
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
    } else {
      reject('env.callDomainModel 未实现')
    }
    
    // ajax({
    //   params: {
    //     query: { 
    //       id
    //     },
    //     action: 'DELETE'
    //   },
    //   serviceId: domainConfig.serviceId,
    //   fileId: domainConfig.fileId,
    //   projectId: domainConfig.projectId
    // }).then(r => {
    //   resolve(r)
    // })
  })

}