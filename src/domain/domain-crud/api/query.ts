import { ajax } from '../util'

export default function queryData(domainConfig, { query, pageParams, ordersParams }) {
  console.log('domainConfig', domainConfig)
  const pagination = true
  const { fields = [] } = domainConfig
  let subEntitis = new Set()
  // 额外添加子实体的名称，如"角色.名称"中的”角色“
  fields.forEach(item => {
    const names = item?.name?.split('.') || []
    if (names.length > 0) {
      subEntitis.add(names[names.length - 2])
    }
  })
  subEntitis.forEach(item => {
    fields.push({
      name: item
    })
  })

  return new Promise((resolve, reject) => {
    ajax({
      params: {
        query,
        fields: fields,
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