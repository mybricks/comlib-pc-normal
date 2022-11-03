export const DefaultStyle = {
  color: 'rgba(0,0,0,1)',
  fontSize: '14px',
  lineHeight: '28px',
  paddingBottom: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '10px'
};

export enum BehaviorEnum {
  Auto = 'auto',
  Smooth = 'smooth'
}
export enum PositionEnum {
  Start = 'start',
  Center = 'center',
  End = 'end',
  Nearest = 'nearest'
}

export enum AlignTypeEnum {
  Center = 'center',
  Left = 'flex-start',
  Right = 'flex-end'
}

interface SlotItem {
  slotId: string;
  key: string;
  title: string;

  styleCatelog?: string;
  style?: Record<string, any>;
  activeStyle?: Record<string, any>;
}
export interface Data {
  componentId: string;

  scrollConfig: {
    behavior: BehaviorEnum;
    block: PositionEnum;
    inline: PositionEnum;
  };

  slotList: SlotItem[];

  useTitleFixed?: boolean;
  titleStyle: Record<string, any>;
  titleMargin: number;
  titleAlign: AlignTypeEnum;
}
