import { ajax } from '../util'
import { message } from 'antd'

export default function updateData(domainConfig, params) {
  console.log(domainConfig)
  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query: { ...params },
        action: 'UPDATE'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId
      // projectId: projectId || undefined
    }).then(r => {
      resolve(r)
    })
  })

}