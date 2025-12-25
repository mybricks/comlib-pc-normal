import { getFilterSelector } from '../utils/cssSelector';
import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

const version = ANTD_VERSION === 4 ? "" : "antd5."

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
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '标签页Tabs，上方文字下方高亮条的选项卡。',
    usage: `标签页Tabs，上方文字下方高亮条的选项卡。

slots插槽
tab0: 标签页1（tabN 代表标签项 N+1）

styleAry声明
标签为内部高度为46px的组件，有#1677FF的高亮色，对标antd的Tabs组件。
  在默认状态下，由「标签」来控制字体颜色、背景
  在激活状态下，由「标签文本」「标签」「选中条」来控制激活状态下的样式，选中条则是下方的高亮横线，默认为height = 2px，backgroundColor: #1677FF

注意：
  - 「样式/默认/底部横线」为整体标签底部的贯穿横线，默认为borderBottom: 1px solid #F0F0F0，如需隐藏请配置为borderBottom: none；

关于插槽的使用
当需要插槽（隐藏插槽占位=false）时：
  尽量每个插槽下都要有内容，不同的标签页对应不同的插槽，往往展示不同的内容；
当不需要插槽（隐藏插槽占位=true）时：
  则隐藏插槽内容，高度只剩下标签高度，此时组件高度必须设置为height=46，不可修改；

注意事项:
  - 标签项的上下默认含12px的padding，所有菜单项都不允许配置padding!；
  - 因为没有继承效果，如果「样式/默认/标签」配置了样式，激活时的「标签文本」「标签」「选中条」也需要配置。
  - 标签头需要注意，加一个左侧内边距，防止内容标签项贴着标签头左侧，视觉不美观。
  - 标签项高亮条颜色需要特别留意，要和用户给的示例图片中的高亮条颜色完全一致。
  - 标签头部背景色和下方的标签项内容背景色要特别留意，要和用户给的示例图片中的背景色完全一致。
  - 标签项需要给一个margin-left，防止所有标签项挤在一起，没有呼吸空间。
  - 如果默认标签有padding-left、padding-right，则选中的标签也必须有一样的padding-left、padding-right，不然会导致点击后跳动。
    `,
//     usage: `
// # data定义
// \`\`\` typescript
// /** 智能排版、智能布局 */
// interface SmartSlotStyle {
//   position: 'smart'
//   display: 'block'
// }

// /** 自由排版、自由布局 */
// interface AbsoluteSlotStyle {
//   position: 'absolute'
//   display: 'block'
// }

// interface FlexSlotStyle {
//   alignItems: 'flex-start' | 'center' | 'flex-end'
//   justifyContent: 'normal' | 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
//   columnGap: number
//   rowGap: number
//   flexWrap: 'wrap' | 'nowrap'
// }

// /** 横向排版、横向布局 */
// interface FlexRowSlotStyle extends FlexSlotStyle {
//   position: 'inherit'
//   display: 'flex'
//   flexDirection: 'row'
// }

// /** 纵向排版、纵向布局 */
// interface FlexColumnSlotStyle extends FlexSlotStyle {
//   position: 'inherit'
//   display: 'flex'
//   flexDirection: 'column'
// }

// /**
//  * 布局模式
//  * 1. 当需要从智能/自由排版转换为弹性布局时：
//  *    - position必须从'smart'/'absolute'改为'inherit'
//  *    - display必须从'block'改为'flex'
//  * 2. 弹性布局分为横向(flexDirection: 'row')和纵向(flexDirection: 'column')两种
//  * 3. 切换布局类型时，必须确保所有必填字段都被正确设置
//  */
// type SlotStyle = SmartSlotStyle | AbsoluteSlotStyle | FlexRowSlotStyle | FlexColumnSlotStyle

// interface TabItem {
//   /** 唯一key */
//   key: string;
//   /** 标签默认名称 */
//   name: string;
//   /** 开启后，可以点击删除按钮删除标签页 */
//   closable?: boolean;
//   /** 是否显示图标（icon) */
//   showIcon?: boolean;
//   /** 开启后，可以通过逻辑连线连接标签的输入项【设置标签页的通知数】动态显示通知 */
//   dynamic?: boolean;
//   /** 唯一id，值与key保持一致 */
//   id: string;
//   /** 配置标签页的文字提示 */
//   tooltipText?: string;
//   /** 可选择是否需要自定义图标 */
//   isChoose?: boolean;
//   /** 设置tabs中icon */
//   icon?: string;
//   /** 配置通知的展示类型，包括文本和状态点类型 */
//   infoType?: 'text' | 'icon';
//   /** 配置标签页的尺寸，默认是常规类型（default） */
//   size?: 'default' | 'small';
//   /** 设置状态点的位置偏移, 横向和纵向 */
//   offset?: number[];
//   /** 设置状态点的类型, 有成功、进行中、默认、错误、警告等类型 */
//   status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
//   /** 数值为0时, 状态点是否显示 */
//   showZero?: boolean;
// }

// export default interface Data {
//   /** 配置标签页的外观(基本样式)，包括卡片和简约类型 */
//   type: 'editable-card' | 'line';
//   /** 标签页是否居中 */
//   centered: boolean;
//   /** 标签项配置列表 */
//   tabList: TabItem[];
//   /** 开启后，禁止点击切换标签页 */
//   prohibitClick: boolean;
//   /** 当前选中的标签项key值 */
//   defaultActiveKey: string | undefined;
//   /** 标签位置, 默认是上部(top) */
//   tabPosition: 'left' | 'top' | 'bottom' | 'right';
//   /** 配置前提是data.type === "editable-card"，开启后，可以点击新增标签页 */
//   hideAdd?: boolean;
//   /** 是否隐藏插槽占位，禁止插槽渲染 */
//   hideSlots?: boolean;
//   /** 开启后，左侧新增【左侧内容】插槽 */
//   useLeftExtra?: boolean;
//   /** 开启后，右侧新增【右侧内容】插槽 */
//   useRigthExtra?: boolean;
//   /** 配置前提是data.type === "editable-card" && data.hideAdd === false，开启后，可以通过插槽配置新增按钮，开启后必须新增addIcon插槽 */
//   useAddIcon?: boolean;
//   /** 开启后，可以通过逻辑连线连接标签页的输入项【设置显示tab】设置显示（激活）的标签页 */
//   useDynamicTab?: boolean;
//   /** 标签页被隐藏时是否渲染 DOM 结构 */
//   forceRender?: boolean;
//   /** 标签页大小, 默认是中(middle) */
//   size?: 'small' | 'middle' | 'large';
//   /** 全局标签插槽的布局模式 */
//   slotStyle: SlotStyle
//   /** 开启后，可以点击删除按钮删除标签页 */
//   closable?: boolean
//   /** 开启后，可以通过逻辑连线连接标签页的输入项【设置标签页数据】动态设置标签页，dynamicTabs需要与hideSlots值保持一致 */
//   dynamicTabs?: boolean
// }
// \`\`\`

// # slots定义
// | id | type | description |
// |------|------|------|------|
// | data.tabList[].id | normal | 标签项动态插槽，对应 \`data.tabList[].id\` |
// | leftExtra | normal | 左侧内容区插槽，当 \`data.useLeftExtra === true\` 时允许使用 |
// | rigthExtra | normal | 右侧内容区插槽，当 \`data.useRigthExtra === true\` 时允许使用 |
// | addIcon | normal | 新增操作内容区插槽，当 \`data.type === "editable-card" && data.hideAdd === false && data.useAddIcon === true\` 时允许使用 |
// `
  },
  execute(dsl, context) {
    const { data } = context;

    handleMerge(data, dsl);
  },
  modifyTptJson: (component) => {
    if (!component?.data) {
      component.data = {}
    }
    component.data.tabList.forEach((item, index) => {
      item.key = `tab${index}`,
        item.id = `tab${index}`,
        item.infoType = 'text',
        item.size = "default",
        item.showZero = false
    })
    component.data = {
      ...component.data,
      prohibitClick: false,
    }
    component?.style?.styleAry?.forEach((style, index) => {
      if (style.selector == ".nav_wrap") {
        style.selector = '.ant-tabs .ant-tabs-nav-wrap'
      }
      if (style.selector == ".nav_item") {
        style.selector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab:not(.ant-tabs-tab-active)${getFilterSelector(component.id)}`
      }
      if (style.selector == ".nav_item_active") {
        style.selector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(component.id)} div.ant-tabs-tab-btn span`
      }
      if (style.selector == '.nav_line') {
        style.selector = `.ant-tabs .ant-tabs-nav .ant-tabs-ink-bar${getFilterSelector(component.id)}`
      }
      // if (style.selector == ".content") {
      //   style.selector = [`.ant-tabs .ant-tabs-content-holder`]
      // }
      // if (style.selector == ".tab") {
      //   style.selector = [`.ant-tabs`, `.ant-tabs-content-holder`, `.ant-tabs-content`]
      // }
    })
  },
  editors: [
    '常规/插槽布局',
    '常规/标签位置',
    '常规/标签居中',
    '常规/隐藏插槽占位',
    {
      title: '常规/标签项',
      description: `通过数组来配置所有标签
#示例数据
[
  {
    "name": "标签页1",
    "key": "tab0",
    "id": "tab0"
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          value.forEach((item, index) => {
            item.infoType = 'text'
            item.size = "default"
            item.showZero = false

            slot.add({
              id: item.id,
              title: item.name
            });

            output.add(`${item.id}_into`, `${item.name}显示`, { type: 'any' });
            output.add(`${item.id}_leave`, `${item.name}隐藏`, { type: 'any' });
          })

          data.tabList = value

          data.prohibitClick = false
        }
      }
    },
    '样式/默认/标签',
    '样式/默认/标签头',
    '样式/默认/底部横线',
    '样式/Hover/标签',
    '样式/激活/标签文本',
    '样式/激活/标签',
    '样式/激活/选中条'
  ],
}
