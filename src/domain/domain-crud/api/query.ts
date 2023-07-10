// import { ajax } from '../util'

export default function queryData(callDomainModel, domainModel, domainConfig, { query, pageParams, ordersParams }) {
  // console.log('domain', domainModel)

  const { fields = [] } = domainConfig
  let subEntitis = new Set()
  // 额外添加子实体的名称，如"角色.名称"中的”角色“
  fields.forEach(item => {
    const names = item?.name?.split('.') || []
    if (names.length > 1) {
      subEntitis.add(names[names.length - 2])
    }
  })
  subEntitis.forEach(item => {
    fields.push({
      name: item
    })
  })

  return new Promise((resolve, reject) => {
    if (callDomainModel) {
      callDomainModel(domainModel, 'SELECT', {
        query,
        fields,
        orders: ordersParams,
        page: pageParams.usePagination ? {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize
        } : undefined,
      }).then(r => {
        if (r.code === 1) {
          resolve({
            dataSource: r.data.dataSource,
            pageNum: r.data.pageNum,
            pageSize: r.data.pageSize,
            total: r.data.total
          })
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
  })

}