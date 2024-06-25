export interface Data {
  waitRenderTime: number;
  contentSlotStyle: any;
  documentTitle: string;
}

export enum InputIds {
  StartPrint = 'startPrint'
}

export enum OutputIds {
  AfterPrint = 'afterPrint'
}

export const SlotIds = {
  CONTENT: 'content',
}