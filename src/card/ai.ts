import merge from "lodash/merge";
import { setSlotLayout } from "./editors";
import { SlotIds } from "./constants";

export default {
  ignore: true,
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '卡片',
    usage: `
# data定义
\`\`\` typescript
/** 智能排版、智能布局 */
interface SmartSlotStyle {
  position: 'smart'
  display: 'block'
}

/** 自由排版、自由布局 */
interface AbsoluteSlotStyle {
  position: 'absolute'
  display: 'block'
}

interface FlexSlotStyle {
  alignItems: 'flex-start' | 'center' | 'flex-end'
  justifyContent: 'normal' | 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  columnGap: number
  rowGap: number
  flexWrap: 'wrap' | 'nowrap'
}


/** 横向排版、横向布局 */
interface FlexRowSlotStyle extends FlexSlotStyle {
  position: 'inherit'
  display: 'flex'
  flexDirection: 'row'
}

/** 纵向排版、纵向布局 */
interface FlexColumnSlotStyle extends FlexSlotStyle {
  position: 'inherit'
  display: 'flex'
  flexDirection: 'column'
}

/**
 * 布局模式
 * 1. 当需要从智能/自由排版转换为弹性布局时：
 *    - position必须从'smart'/'absolute'改为'inherit'
 *    - display必须从'block'改为'flex'
 * 2. 弹性布局分为横向(flexDirection: 'row')和纵向(flexDirection: 'column')两种
 * 3. 切换布局类型时，必须确保所有必填字段都被正确设置
 */
type SlotStyle = SmartSlotStyle | AbsoluteSlotStyle | FlexRowSlotStyle | FlexColumnSlotStyle

interface Item {
  key: string;
  name: string;
}

export default interface Data {
  /** 名称 */
  title: string;
  /** 是否开启卡片右上角操作区 */
  useExtra?: boolean;
  /** 卡片尺寸 */
  size?: 'default' | 'small';
  /** 鼠标移过时可浮起 */
  hoverable?: boolean;
  /** 开启后可配置卡片的点击事件 */
  useClick?: boolean;
  /** 输出项【单击卡片】和【双击卡片】事件的输出数据 */
  outputContent?: any;
  /** 输出项【单击卡片】和【双击卡片】事件的输出数据类型 */
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  /** 开启卡片底部操作区 */
  isAction: boolean;
  /** 开启卡片底部操作区的操作项 */
  items: [Item];
  /** 卡片内容区的内边距 */
  padding: string;
  /** dataType值为external时，输出项【单击卡片】和【双击卡片】事件的输出数据内容 */
  inVal: any;
  /** 自定义内容区高度，开启后,可自定义卡片内容容器高度,超出内容滚动 */
  isHeight: boolean;
  /** 内容区高度，卡片内容的自定义高度 */
  height: string;
  /** 展示卡片的标题内容 */
  showTitle: boolean;
  /** 内容区插槽的布局模式 */
  slotStyle?: SlotStyle; 
}
\`\`\`

# slots定义
| id | type | description |
|------|--------|--------|
| body | normal | 内容区插槽 |
| extra | normal | 卡片右上角操作区，当 \`data.useExtra === true\` 时允许使用 |
| data.items[].key | normal | 表格列动态插槽，当 \`data.isAction === true\` 时允许使用，对应 \`data.items[].key\` |

# 注意
 - 
`
  },
  execute(dsl, context) {
    const { data, slots } = context;

    merge(data, dsl);

    const { slotStyle } = data;
    const slotInstance = slots.get(SlotIds.Body);

    setSlotLayout(slotInstance, slotStyle);
  }
}