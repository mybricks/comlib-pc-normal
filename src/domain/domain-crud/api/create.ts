import { ajax } from '../util'

export default function createData(domainConfig, params) {
  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query: { ...params },
        action: 'INSERT'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId
      // projectId: projectId || undefined
    }).then(r => {
      resolve(r)
    })
  })

}