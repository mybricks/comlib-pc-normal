import { ajax } from '../util'

export default function createData(domainConfig, params) {
  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query: { ...params },
        action: 'INSERT'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId,
      projectId: domainConfig.projectId
    }).then(r => {
      resolve(r)
    })
  })

}