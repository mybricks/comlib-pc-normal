export enum WidthTypeEnum {
  FitContent = 'fit-content'
}

export enum AlignTypeEnum {
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}
export enum SizeTypeEnum {
  Default = 'default',
  Small = 'small',
  Simple = 'simple'
}

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
export interface Data {
  total: number;
  text: string;
  current: number;
  currentPage: {
    pageNum: number;
    pageSize: number;
  };
  isDynamic: boolean;
  disabled?: boolean;
  defaultPageSize: number;
  align: AlignTypeEnum;
  size: SizeTypeEnum;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  hideOnSinglePage?: boolean;
}

export const OutputIds = {
  PageChange: 'pageChange',
  GetPageInfo: 'getPageInfo',
  SetTotalDone: 'setTotalDone',
  SetPageNumDone: 'setPageNumDone'
};
export const InputIds = {
  SetEnable: 'setEnable',
  SetDisable: 'setDisable',

  SetTotal: 'setTotal',
  SetPageNum: 'setPageNum',

  GetPageInfo: 'getPageInfo'
};
export const Schemas = {
  Any: {
    type: 'any'
  }
};

export const templateRender = (template: string, params: any) => {
  return template.replace(/\{([^\{\}]*?)\}/g, (match, key) => {
    switch (key?.trim?.()) {
      case 'total':
        return params?.total;
      case 'start':
        return params?.start;
      case 'end':
        return params?.end;
      default:
        return `{${key}}`;
    }
  });
};
