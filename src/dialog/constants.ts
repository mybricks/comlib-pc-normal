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
 * @param useFooter  是否使用底部内容
 * @param cancelText 取消按钮内容
 * @param width      弹窗宽度
 * @param hideTitle  隐藏标题
 */

export enum Location {
  FRONT = 'front',
  BACK = 'back'
}
export interface Data {
  visible?: boolean;
  title: string;
  okText: string;
  closable: boolean;
  centered: boolean;
  useFooter: boolean | number;
  footerType: number;
  cancelText: string;
  width?: number;
  hideTitle: boolean;
  bodyStyle?: React.CSSProperties;
  footerBtns: (ButtonProps & {
    id: string;
    useIcon?: boolean;
    showText?: boolean;
    location?: Location;
    dynamicDisabled?: boolean;
    dynamicHidden?: boolean;
    hidden?: boolean;
    // 输出传入数据
    outputDs?: boolean;
  })[];
  getContainer?: () => any;
}

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
  Cancel: 'cancel'
};
export const SlotIds = {
  Footer: 'footer'
};
