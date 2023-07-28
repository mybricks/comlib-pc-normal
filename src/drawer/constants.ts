export interface Data {
  title: string;
  position: 'top' | 'right' | 'bottom' | 'left' | undefined;
  closable: boolean; //是否显示关闭按钮
  showMask: boolean; //是否显示遮罩
  visible: boolean; //抽屉是否显示
  width: number; //left | right 时宽度
  height: number; //top | bottom 时高度
  useFooter: boolean; //是否使用页脚
  footerAlign: string; //页脚布局 left | right | center
  showEditArea: boolean; //是否显示内容编辑区
  showFull: boolean; //position 为 top | bottom 时是否展开全部内容
  bodyStyle?: React.CSSProperties;
  inputData?: any;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  footerBtns: any[];
}

export const InputIds = {
  Open: 'open',
  Close: 'close',
  SetTitle: 'title'
}
export const OutputIds = {
  Cancel: 'cancel',
}
export const SlotIds = {
  Content: 'content',
  Footer: 'footer',
  DataSource: 'dataSource'
}

export enum Location {
  FRONT = 'front',
  BACK = 'back'
}

export const DefaultEvent = {
  Ok: 'ok',
  Cancel: 'cancel'
};