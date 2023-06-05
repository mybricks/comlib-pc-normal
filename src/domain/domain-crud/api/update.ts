import { ajax } from '../util'

export default function updateData(domainConfig, params) {
  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query: { ...params },
        action: 'UPDATE'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId,
      projectId: domainConfig.projectId
    }).then(r => {
      resolve(r)
    })
  })

}