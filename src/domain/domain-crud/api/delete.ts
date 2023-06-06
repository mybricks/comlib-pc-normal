import { ajax } from '../util'

export default function deleteData(domainConfig, id) {

  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query: { 
          id
        },
        action: 'DELETE'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId,
      projectId: domainConfig.projectId
    }).then(r => {
      resolve(r)
    })
  })

}