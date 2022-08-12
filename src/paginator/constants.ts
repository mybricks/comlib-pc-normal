export type AlignType = 'flex-start' | 'center' | 'flex-end';
export type SizeType = 'default' | 'small' | 'simple';
export class Page {
  pageNum: number;
  pageSize: number
};

/**
 * 数据源
 * @param total 总条数
 * @param text 说明文字
 * @param current 当前页数
 * @param currentPage 当前页面
 * @param isDynamic 是否支持动态启用/禁用
 * @param disabled 是否禁用
 * @param defaultPageSize 默认每页条数
 * @param align 位置
 * @param showSizeChanger 每页条数配置功能
 * @param showQuickJumper 跳转页面功能
 * @param hideOnSinglePage 只有一页时隐藏分页器
 * @param size 尺寸
 */
export class Data {
  total: number;
  text: string;
  current: number;
  currentPage: Page;
  isDynamic: boolean;
  disabled?: boolean;
  defaultPageSize: number;
  align: AlignType;
  size: SizeType;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  hideOnSinglePage?: boolean;
}
