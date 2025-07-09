import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

const handleMerge = (preData, curData) => {
  mergeWith(preData, curData, (pre, cur, key) => {
    if (key === "btnList") {
      return merge(Array.from({length: cur.length}, () => {
        return {
          text: '按钮',
          showText: true,
          dataType: 'number',
          outVal: 0,
          inVal: '',
          isCustom: false,
          src: '',
          contentSize: [14, 14],
          iconDistance: 8,
          loading: false,
          useDynamicLoading: false,
          style: {
            height: 'auto',
            width: 'auto'
          },
          isSlot: false,
          useIcon: false
        }
      }), pre, cur)
    }
    return undefined;
  })
}

export default {
  ignore: true,
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '工具条，当有横向排布多个按钮的场景，必须推荐此组件',
    usage: `
# data定义
\`\`\` typescript
enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}

enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}

enum SizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small'
}

enum ShapeEnum {
  Default = 'default',
  Circle = 'circle',
  Round = 'round'
}

enum TypeEnum {
  Default = 'default',
  Primary = 'primary',
  Ghost = 'ghost',
  Dashed = 'dashed',
  Link = 'link',
  Text = 'text',
  Danger = 'danger',
  ALink = 'a'
}

interface BtnItem {
  /** 唯一标识 */
  key: string;
  /** 按钮文字 */
  text: string;
  /** 动态设置按钮文字 */
  useDynamicText?: boolean;
  /** 动态设置按钮部分样式 */
  useDynamicStyle?: boolean;
  /** 形状 */
  shape?: ShapeEnum;
  /** 尺寸 */
  size?: SizeEnum;
  // 样式
  // style: React.CSSProperties | false;
  /** 按钮类型 */
  type?: TypeEnum;
  /** 使用图标 */
  useIcon?: boolean;
  /** 图标 */
  icon?: string;
  /** 显示文字 */
  showText?: boolean;
  /** 图标位置 */
  iconLocation?: LocationEnum;
  /** 图标间距 */
  iconDistance?: number;
  /** 是否图标自定义 */
  isCustom?: boolean;
  /** 自定义图标地址 */
  src?: string;
  /** 图标尺寸 */
  contentSize: [number, number];
  /** 是否动态启用/禁用按钮，开启会增加启用/禁用按钮的输入输出项 */
  useDynamicDisabled?: boolean;
  /** 是否动态显示/隐藏按钮，开启会增加显示/隐藏按钮的输入输出项 */
  useDynamicHidden?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 隐藏 */
  hidden?: boolean;
  //触发数据类型
  /** 输出数据类型 */
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  /** 输出值 */
  outVal: any;
  /** 当dataType为external时，输出的值 */
  inVal: any;
  /** 是否动态设置按钮的loading状态，开启会增加开启loading和关闭loading的输入输出项 */
  useDynamicLoading: boolean;
  /** 是否是危险按钮 */
  danger?: boolean;
  /** 是否插槽，注意只能初始化时设置，不允许被修改 */
  isSlot?: boolean;
}

export default interface Data {
  /** 按钮列表 */
  btnList: BtnItem[];
  /** 按钮的对齐方式 */
  layout: AlignEnum;
  /** 按钮之间的间距 */
  spaceSize: [number, number];
  /** 超出工具条长度的按钮，是否折叠成省略号 */
  useEllipses?: boolean;
  /** 当useEllipses值为true时，工具条中最多显示的按钮数量，超出数量的按钮将折叠成省略号 */
  maxShowNumber?: number;
  /** 全局配置按钮形状 */
  allShape?: ShapeEnum;
  /** 全局配置按钮尺寸 */
  allSize?: SizeEnum;
  /** 全局配置按钮类型 */
  allType?: TypeEnum;
  /** 全局配置按钮为危险按钮 */
  allDanger?: boolean;
}
\`\`\`

# slots定义
| id | type | description |
|------|--------|--------|
| data.btnList[].key | normal | 按钮列表项作为插槽，当 \`data.items[].isSlot === true\` 时，对应 \`data.btnList[].key\` |

# 注意
 - 危险按钮不是按钮类型，注意理解区分
`
  },
  execute(dsl, context) {
    const { data } = context;

    handleMerge(data, dsl);
  },
}
