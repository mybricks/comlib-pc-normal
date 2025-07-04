import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

const handleMerge = (preData, curData) => {
  mergeWith(preData, curData, (pre, cur, key) => {
    if (key === "tabList") {
      return merge(Array.from({length: cur.length}, () => {
        return {
          name: "标签页",
          closable: curData.closable || preData.closable,
        }
      }), pre, cur)
    }
    return undefined;
  })
}

export default {
  prompts: {
    summary: '标签页',
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

interface TabItem {
  /** 唯一key */
  key: string;
  /** 标签默认名称 */
  name: string;
  /** 开启后，可以点击删除按钮删除标签页 */
  closable?: boolean;
  /** 是否显示图标（icon) */
  showIcon?: boolean;
  /** 开启后，可以通过逻辑连线连接标签的输入项【设置标签页的通知数】动态显示通知 */
  dynamic?: boolean;
  /** 唯一id，值与key保持一致 */
  id: string;
  /** 配置标签页的文字提示 */
  tooltipText?: string;
  /** 可选择是否需要自定义图标 */
  isChoose?: boolean;
  /** 设置tabs中icon */
  icon?: string;
  /** 配置通知的展示类型，包括文本和状态点类型 */
  infoType?: 'text' | 'icon';
  /** 配置标签页的尺寸，默认是常规类型（default） */
  size?: 'default' | 'small';
  /** 设置状态点的位置偏移, 横向和纵向 */
  offset?: number[];
  /** 设置状态点的类型, 有成功、进行中、默认、错误、警告等类型 */
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  /** 数值为0时, 状态点是否显示 */
  showZero?: boolean;
}

export default interface Data {
  /** 配置标签页的外观(基本样式)，包括卡片和简约类型 */
  type: 'editable-card' | 'line';
  /** 标签页是否居中 */
  centered: boolean;
  /** 标签项配置列表 */
  tabList: TabItem[];
  /** 开启后，禁止点击切换标签页 */
  prohibitClick: boolean;
  /** 当前选中的标签项key值 */
  defaultActiveKey: string | undefined;
  /** 标签位置, 默认是上部(top) */
  tabPosition: 'left' | 'top' | 'bottom' | 'right';
  /** 配置前提是data.type === "editable-card"，开启后，可以点击新增标签页 */
  hideAdd?: boolean;
  /** 是否隐藏插槽占位，禁止插槽渲染 */
  hideSlots?: boolean;
  /** 开启后，左侧新增【左侧内容】插槽 */
  useLeftExtra?: boolean;
  /** 开启后，右侧新增【右侧内容】插槽 */
  useRigthExtra?: boolean;
  /** 配置前提是data.type === "editable-card" && data.hideAdd === false，开启后，可以通过插槽配置新增按钮，开启后必须新增addIcon插槽 */
  useAddIcon?: boolean;
  /** 开启后，可以通过逻辑连线连接标签页的输入项【设置显示tab】设置显示（激活）的标签页 */
  useDynamicTab?: boolean;
  /** 标签页被隐藏时是否渲染 DOM 结构 */
  forceRender?: boolean;
  /** 标签页大小, 默认是中(middle) */
  size?: 'small' | 'middle' | 'large';
  /** 全局标签插槽的布局模式 */
  slotStyle: SlotStyle
  /** 开启后，可以点击删除按钮删除标签页 */
  closable?: boolean
  /** 开启后，可以通过逻辑连线连接标签页的输入项【设置标签页数据】动态设置标签页，dynamicTabs需要与hideSlots值保持一致 */
  dynamicTabs?: boolean
}
\`\`\`

# slots定义
| id | type | description |
|------|------|------|------|
| data.tabList[].id | normal | 标签项动态插槽，对应 \`data.tabList[].id\` |
| leftExtra | normal | 左侧内容区插槽，当 \`data.useLeftExtra === true\` 时允许使用 |
| rigthExtra | normal | 右侧内容区插槽，当 \`data.useRigthExtra === true\` 时允许使用 |
| addIcon | normal | 新增操作内容区插槽，当 \`data.type === "editable-card" && data.hideAdd === false && data.useAddIcon === true\` 时允许使用 |
`
  },
  execute(dsl, context) {
    const { data } = context;

    handleMerge(data, dsl.data);
  },
}
