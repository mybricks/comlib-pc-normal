export default {
  ignore: true,
  summary: `分页器 Pagination。`,
  usage: `data数据模型
total: number
text: string = '共 {total} 条结果'
currentPage: {
  pageNum: number,
  pageSize: number
}
defaultPageSize: number
showSizeChanger: boolean = false
pageSizeOptions: number[] = [10, 20, 50, 100]
showQuickJumper: boolean = false
hideOnSinglePage: boolean = false
  `
};