import { ButtonProps } from 'antd/es/button';

export enum FOOTER_CONTENT_TYPE {
  NONE,
  BUTTONS,
  SLOT
}
/**
 * Event
 * @function ok     确认事件
 * @function close  关闭对话框
 * @function cancel 取消事件
 */
export interface Event {
  cancel: () => void;
  [key: string]: () => void;
}

/**
 * Data
 * @param title      标题
 * @param okText     确认按钮内容
 * @param closable   是否显示右上角关闭按钮
 * @param centered   是否设置垂直居中
 * @param useFooter  是否使用工具条
 * @param cancelText 取消按钮内容
 * @param width      弹窗宽度
 * @param hideTitle  隐藏标题
 * @param isNew      是否为改造后的对话框
 */

export enum Location {
  FRONT = 'front',
  BACK = 'back'
}

export type DialogButtonProps = ButtonProps & {
  id: string;
  useIcon?: boolean;
  showText?: boolean;
  location?: Location;
  dynamicDisabled?: boolean;
  dynamicHidden?: boolean;
  hidden?: boolean;
  visible: boolean;
  isConnected?: boolean;
  useBtnLoading?: boolean;
  autoClose?: boolean;
}

export interface Data {
  visible?: boolean;
  title: string;
  okText: string;
  closable: boolean;
  centered: boolean;
  useFooter: boolean | number;
  cancelText: string;
  width?: number;
  hideTitle: boolean;
  isNew?: boolean;
  bodyStyle?: React.CSSProperties;
  footerLayout: AlignEnum;
  footerBtns: DialogButtonProps[];
  destroyOnClose?: boolean;
  maskClosable?: boolean;
  getContainer?: () => any;
}

export const DefaultEvent = ['ok', 'cancelBtn'];

export const InputIds = {
  Open: 'open',
  Close: 'close',
  SetTitle: 'title',
  HideFooter: 'hideFooter',
  ShowFooter: 'showFooter',
  ShowTitle: 'showTitle',
  HideTitle: 'hideTitle'
};
export const OutputIds = {
  Cancel: 'cancel',
  AfterClose: 'afterClose',
};
export const SlotIds = {
  Footer: 'footer',
  Container: 'container'
};
export const SlotInputIds = {
  DataSource: 'dataSource',
};

export enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}