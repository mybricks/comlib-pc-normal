import { TabsProps } from "antd";

/**
 * 标签页配置项
 * @param key 唯一id
 * @param name 名称
 */
export interface TabItem {
  key: string;
  name: string;
  closable?: boolean;
  showIcon?: boolean;
  dynamic?: boolean;
  num?: number | string;
  outputContent?: string;
  permission?: { id: string };
  id: string;

  tooltipText?: string;
  //设置tabs中是否需要icon
  isChoose?: boolean;
  // 设置tabs中icon
  icon?: string;
  //是否已经render
  render?: boolean

  //类型
  infoType: 'text' | 'icon';
  //状态点尺寸
  size: 'default' | 'small';
  //偏移量
  offset: number[];
  //状态
  status: 'success' | 'processing' | 'default' | 'error' | 'warning';
  //showZero
  showZero: boolean;
}
/**
 * 数据源
 * @param type 类型（外观）
 * @param centered 标签是否居中
 * @param tabList 标签页配置数组
 * @param prohibitClick 是否禁止点击切换tab
 * @param defaultActiveKey 当前tab的key值
 * @param tabPosition 标签未知
 */
export interface Data {
  type: any;
  centered: boolean;
  tabList: TabItem[];
  prohibitClick: boolean;
  defaultActiveKey: string | undefined;
  tabPosition: 'left' | 'top' | 'bottom' | 'right';
  hideAdd?: boolean;
  hideSlots?: boolean;
  active?: boolean;

  useLeftExtra?: boolean;
  useRigthExtra?: boolean;
  // 是否动态设置显示tab
  useDynamicTab?: boolean;
  /** @description 1.0.14 隐藏时渲染 */
  forceRender?: boolean;
  /** @description 1.0.15 尺寸 */
  size?: TabsProps['size'];
  /** @description v1.0.19 插槽样式 */
  slotStyle: {},
  closable?: boolean
  dynamicTabs?: boolean
}

export enum SlotIds {
  LeftExtra = 'leftExtra',
  RigthExtra = 'rigthExtra'
}

export enum InputIds {
  SetActiveTab = 'active',
  PreviousTab = 'previous',
  NextTab = 'next',
  OutActiveTab = 'outActiveTab',
  SetShowTab = 'setShowTab',
  SetTabs = 'setTabs',
  GetTabs = 'getTabs'
}

export enum OutputIds {
  OnTabClick = 'tabClick',
  OutActiveTab = 'outActiveTab',
  SetActiveTabComplete = 'activeComplete',
  PreviousTabComplete = 'previousComplete',
  NextTabComplete = 'nextComplete',
  SetShowTabComplete = 'setShowTabComplete',
  AddTab = 'addTab',
  RemoveTab = 'removeTab',
  SetTabsDone = 'setTabsDone',
  GetTabsDone = 'getTabsDone'
}
