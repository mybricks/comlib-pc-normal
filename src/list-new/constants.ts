import { ListGridType } from 'antd/lib/list';

export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading',
  GetDataSource = 'getdataSource',
  AddItem = 'addItem',
  RemoveItem = 'removeItem',
  ChangeItem = 'changeItem',
  MoveUp = 'moveUp',
  MoveDown = 'moveDown'
}
export enum OutputIds {
  GetDataSource = 'getdataSource',
  SortComplete = 'sortComplete'
}

export enum Layout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Grid = 'grid'
}

export const Schemas = {
  Array: {
    type: 'array',
    items: {
      title: '列表数据',
      type: 'any'
    }
  }
}

export interface Option {
  point: number;
  relation: string; 
  columns: number;
}
export interface Data {
  //数据源
  dataSource: any[];
  //获取列表数据
  useGetDataSource?: boolean;

  //加载中动画
  useLoading?: boolean;
  //加载中文案
  loadingTip?: string;

  //是否自动换行
  isAuto?: boolean;
  //是否横向滚动
  isScroll?: boolean;
  //是否自定义列数
  isCustom?: boolean;
  //列数
  column: number;
  //间隔
  grid: ListGridType & {   //移动端列数
    mobileColumn: number;
  };
  canSort: boolean;

  //自定义rowKey
  rowKey: string;

  /** 布局类型 */
  layout: Layout;

  //响应式布局
  isResponsive: boolean;
  //List断点列数
  bootstrap: number[];
  //横向滚动，列表项宽度
  itemWidth: any;
  //自定义断点
  isCustomPoints: boolean;
  //断点配置
  customOptions: Option[];

  //横向布局
  horizonLayout: 'HorizontalLayout' | 'UniformLayout'
}

export const descriptionUpList = [
  {
    type: 'input',
    id: 'dataSource',
    schema: {
      "title": "列表数据",
      "type": "array",
      "description": "列表容器的数据源，数组格式",
      "items": {
        "title": "每一项的数据",
        "type": "any"
      }
    }
  },
  {
    type: 'input',
    id: 'removeItem',
    schema: {
      "type": "number",
      "description": "删除项在原数据源中的索引"
    }
  },
  {
    type: 'input',
    id: 'addItem',
    schema: {
      "type": "object",
      "properties": {
        "index": {
          "type": "number",
          "description": "添加项要放在原数据中的索引"
        },
        "value": {
          "type": "any",
          "description": "添加项的数据内容"
        }
      }
    }
  },
  {
    type: 'input',
    id: 'changeItem',
    schema: {
      "type": "object",
      "properties": {
        "index": {
          "type": "number",
          "description": "修改项要放在原数据中的索引"
        },
        "value": {
          "type": "any",
          "description": "被修改项的新值"
        }
      }
    }
  }
]