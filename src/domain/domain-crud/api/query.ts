import { ajax } from '../util'

export default function queryData(domainConfig, { query, pageParams, ordersParams }) {
  console.log(domainConfig)
  const pagination = true

  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query,
        fields: [
          {
            "name": "id"
          },
          {
            "name": "id"
          },
          {
            "name": "用户名称"
          },
          {
            "name": "年龄"
          },
          {
            "name": "简介"
          },
          {
            "name": "字段0"
          }
        ],
        orders: ordersParams,
        // orders: [
        //   ...orderFields,
        //   hasPrimaryFieldOrder ? undefined : { fieldId: primaryField.id, order: 'DESC' }
        // ].filter(Boolean),
        page: {
          pagination,
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize
        },
        action: 'SELECT'
      },
      serviceId: domainConfig.serviceId,
      fileId: domainConfig.fileId
      // projectId: projectId || undefined
    }).then(r => {

      if (pagination) {
        resolve({
          dataSource: r.dataSource,
          pageNum: r.pageNum,
          pageSize: r.pageSize,
          total: r.total
        })
      } else {
        resolve(r)
      }

    })
  })

}