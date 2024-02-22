import { CSSProperties } from 'react';

export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}
export enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}
export enum SizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small'
}
export enum ShapeEnum {
  Default = 'default',
  Circle = 'circle',
  Round = 'round'
}
export enum TypeEnum {
  Default = 'default',
  Primary = 'primary',
  Ghost = 'ghost',
  Dashed = 'dashed',
  Link = 'link',
  Text = 'text',
  Danger = 'danger',
  ALink = 'a'
}

export type FzCSSProperties = CSSProperties & {
  styleEditorUnfold: boolean;
};
export interface BtnItem {
  // 唯一标识
  key: string;
  // 按钮文字
  text: string;
  // 动态设置按钮文字
  useDynamicText?: boolean;
  // 动态设置按钮部分样式
  useDynamicStyle?: boolean;

  // 形状
  shape?: ShapeEnum;
  // 大小
  size?: SizeEnum;
  // 样式
  style: CSSProperties | false;
  // 按钮类型
  type?: TypeEnum;

  // 使用图标
  useIcon?: boolean;
  // 图标
  icon?: string;
  // 显示文字
  showText?: boolean;
  // 图标位置
  iconLocation?: LocationEnum;
  // 图标间距
  iconDistance?: number;
  //是否图标自定义
  isCustom?: boolean;
  //自定义图标地址
  src?: string;
  //图标尺寸
  contentSize: [number, number];

  // [已废弃]权限key
  permissionKey?: string;
  // 权限信息
  permission?: {
    id: string;
    type: string;
    noPrivilegeType: 'hide' | 'hintLink';
    hintLink?: string;
    registerData?: {
      noPrivilege: 'hide' | 'hintLink';
      code: string;
      title: string;
    };
  };

  // 动态启用/禁用
  useDynamicDisabled?: boolean;
  // 动态显示/隐藏
  useDynamicHidden?: boolean;

  // 禁用
  disabled?: boolean;
  // 隐藏
  hidden?: boolean;

  //触发数据类型
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  //输出值
  outVal: any;
  //外部输入值
  inVal: any;

  //是否开启loading
  loading: boolean;
  //设置动态加载
  useDynamicLoading: boolean;

  // 是否是危险按钮
  danger?: boolean;

  // 是否插槽
  isSlot?: boolean;
}

/**
 * 数据源
 * @param btnList 按钮列表
 * @param layout 对其方式
 * @param spaceSize 间距
 * @param useEllipses 省略
 * @param maxShowNumber 最多显示数量
 */
export interface Data {
  btnList: BtnItem[];
  layout: AlignEnum;
  spaceSize: [number, number];

  useEllipses?: boolean;
  maxShowNumber?: number;

  // 工具条整体样式配置
  allShape?: ShapeEnum;
  allSize?: SizeEnum;
  allType?: TypeEnum;
  allDanger?: boolean;
}
