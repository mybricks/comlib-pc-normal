// import { ajax } from '../util'

export default function deleteData(callDomainModel, domainModel, id) {

  return new Promise((resolve, reject) => {
    callDomainModel(domainModel, 'DELETE', {
      query: {
        id
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