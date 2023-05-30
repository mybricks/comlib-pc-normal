/**
 * Data
 * @param type       提示类型
 * @param layout     对齐方式
 * @param message    消息提示
 * @param content    辅助性文字介绍
 * @param closable   是否显示关闭按钮
 * @param showIcon   是否显示辅助图标
 * @param showInfo   是否显示辅助文字
 * @param banner     是否用做顶部公告
 * @param width      警告栏宽度
 * @param openWidth  是否开启固定宽度
 * @param percentWidth 百分比宽度
 * @param titleStyle 标题样式
 * @param descriptionStyle 辅助介绍样式
 * @param isCustom 自定义字体样式
 * @param pubType 发布于内外网
 */
export interface Data {
  type: any;
  layout: string;
  message: string;
  content: string;
  closable: boolean;
  showIcon: boolean;
  icon?: string;
  isChoose: boolean;
  color?: string;
  textColor?: string;
  isColor?: boolean;
  showInfo: boolean;
  banner: boolean;
  width: number;
  percentWidth: number;
  openWidth: boolean;
  useContentSlot?: boolean;
  titleStyle: Style;
  descriptionStyle: Style;
  isCustom: boolean;
  pubType: "external" | "internal"
}

export interface Style {
  fontSize: string;
  fontStyle: string;
  fontWeight: number;
  lineHeight: string;
  color: string | undefined;
  textDecoration: string
}

export const InputIds = {
  SetMsg: 'inputInfo',
  SetDesc: 'description'
};
export const SlotIds = {
  DescSlot: 'description'
};

export const TypeOptions = [
  {
    label: '默认',
    value: 'info'
  },
  {
    label: '成功',
    value: 'success'
  },
  {
    label: '错误',
    value: 'error'
  },
  {
    label: '警告',
    value: 'warning'
  }
];