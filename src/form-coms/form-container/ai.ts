import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

const version = ANTD_VERSION === 4 ? "" : "antd5."

const handleMerge = (preData, curData) => {
  mergeWith(preData, curData, (pre, cur, key) => {
    if (key === "btnList") {
      return merge(Array.from({length: cur.length}, () => {
        return {
          name: "表单项",
          label: "表单项",
          widthOption: 'span',
          span: 24 / (curData.formItemColumn || preData.formItemColumn),
          colon: 'default',
          labelWidthType: 'default',
          hiddenLabel: false,
          visible: true,
          hidden: false
        }
      }), pre, cur)
    } else if (key === "actions") {
      pre.items = pre.items.slice(0, cur.items.length)
    }
    return undefined;
  })
}

export default {
  prompts: {
    summary: '表单容器',
    usage: `
# data定义
\`\`\` typescript
/**
 * 标题宽度类型
 * px - 固定像素
 * span - 24栅格
 */
type LabelWidthType = 'px' | 'span'

interface Action {
  /** 标题 */
  title: string
  /** 输出项id，禁止修改 */
  outputId: string
  /**
   * 风格
   * primary - 主按钮
   * default - 次按钮
   * dashed - 虚线按钮
   * link - 链接按钮
   * text - 文字按钮
   */
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  /** 唯一key，与outputId相同，禁止修改 */
  key: string
  /** 是否展示 */
  visible?: boolean
  /**
   * 是否是危险按钮样式
   */
  danger?: boolean
  /** 是否使用图标 */
  useIcon: boolean;
  /**
   * 图标位置
   * front - 位于文字前
   * back - 位于文字后
   */
  iconLocation: 'front' | 'back';
  /** 来自图标库的图标 */
  icon: string;
  /** 图标与文字间的距离 */
  iconDistance: number;
}

interface FormItems {
  /** 添加子组件的组件id，随机字符，保证唯一，禁止修改 */
  id: string;
  /** 添加子组件的组件name，随机字符，保证唯一，禁止修改 */
  comName: string
  /** 字段 */
  name: string
  /** 标题 */
  label: string
  /** 当宽度模式为span时（widthOption === 'span'），设置宽度占比 */
  span: number
  /** 是否展示必填样式 */
  required?: boolean
  /**
   * 展示冒号
   * true - 展示
   * false - 隐藏
   * default - 跟随容器 data.config.colon
   */
  colon?: true | false | "default";
  /** 展示在标题后面的悬浮提示内容 */
  tooltip?: string
  /**
   * 标题宽度
   * custom - 自定义
   * default - 跟随容器
   */
  labelWidthType?: 'custom' | 'default'
  /** 当labelWidthType === 'custom'时，配置标题宽度 */
  labelWidth?: number
  /** 显示标题 */
  hiddenLabel?: boolean
  /** 提示语，展示在表单项下方的提示内容 */
  description?: string
  /** 当表单项目布局类型为水平时（data.config.layout === "horizontal"），配置标题的宽度类型 */
  widthOption: LabelWidthType
  /** 当宽度模式为span时（widthOption === 'px'），设置宽度值 */
  width: number
  /** 
   * 标题超长配置
   * ellipse - 超长省略
   * wrap - 自动换行
   * default - 默认
   */
  ellipseMode?: 'wrap' | 'ellipse' | 'default'
}

export default interface Data {
  /** 表单项列表 */
  items: FormItems[]
  /** 操作项配置 */
  actions: {
    /** 操作项列表 */
    items: Action[];
    /** 
     * 当表单项目布局类型为水平时（data.config.layout === "horizontal"），配置操作的宽度类型
     * flexFull - 填充剩余宽度
     */
    widthOption: LabelWidthType | 'flexFull';
    /** 当宽度模式为span时（widthOption === 'px'），设置宽度值 */
    width: number;
    /** 当宽度模式为span时（widthOption === 'span'），设置宽度占比 */
    span: number;
    /** 展示操作项 */
    visible: boolean;
    /**
     * 操作项对齐方式
     * left - 左对齐
     * center - 居中对齐
     * right - 右对齐
     */
    align: 'left' | 'center' | 'right';
    isRight?: false   //  展开/收益按钮位置
  }
  /** 当表单项目布局类型为水平时（data.config.layout === "horizontal"），配置标题的宽度类型 */
  labelWidthType: LabelWidthType
  /** 当标题的宽度类型为px时（data.labelWidthType === 'px'），配置标题宽度 */
  labelWidth: number
  /** 当标题的宽度类型为span时（data.labelWidthType === 'span'），配置标题宽度占比 */
  labelCol: number
  config: {
    /** 标题是否显示冒号 */
    colon: boolean
    /** 
     * 表单项布局，遵循Antd表单Layout字段特性，默认为 “水平”，水平布局：标题与表单项左右水平分布，标题可配置宽度、垂直布局：标题与表单项垂直上下分布，标题在上方，表单项在下方，标题宽度自适应、内联布局：标题与表单项左右水平分布，标题宽度自适应
     * horizontal - 水平
     * vertical - 垂直
     * inline - 内联
     */
    layout: 'horizontal' | 'inline' | 'vertical'
    /** 尺寸, 全局设置表单项尺寸, 默认是中(middle) */
    size: 'small' | 'middle' | 'large'
  }
  /** 提交隐藏表单项字段，提交时收集被隐藏的表单项字段，默认不收集被隐藏的表单项字段 */
  submitHiddenFields: boolean
  /** 校验隐藏表单项字段，提交隐藏表单项字段时，是否需要对隐藏字段进行校验，默认为 True 需要校验 */
  validateHiddenFields: boolean
  /**
   * 标题超长配置
   * wrap - 自动换行
   * ellipse - 超长省略
   * default - 默认
   */
  ellipseMode?: 'wrap' | 'ellipse' | 'default'
  /** 表单项类型布局为水平或垂直data.config.layout !== 'inline'，每行多列布局下，设置每列表单项之间的距离； */
  columnGap?: number
}
\`\`\`

# slots定义
| id | type | description |
|------|--------|--------|
| content | scope | 内容区插槽 |

<examples>
  <!-- 内容修改 -->
  <example>
    <user_query>搭建一个学生成绩录入表单</user_query>
    <assistant_response>
      学生成绩录入表单，一门学科一个表单项
      \`\`\`dsl file="component.dsl"
      <mybricks.normal-pc.${version}form-container data={{items: [{"id":"u_t7YIl","comName":"u_F3Bog","schema":{"type":"number"},"name":"chinese","label":"语文","widthOption":"span","span":24,"colon":"default","labelWidthType":"default","hiddenLabel":false,"visible":true,"hidden":false},{"id":"u_48PsK","comName":"u_QzgI0","schema":{"type":"number"},"name":"math","label":"数学","widthOption":"span","span":24,"colon":"default","labelWidthType":"default","hiddenLabel":false,"visible":true,"hidden":false},{"id":"u_bKcnE","comName":"u_L57Ci","schema":{"type":"string","description":"文本域的值"},"name":"evaluate","label":"评价","widthOption":"span","span":24,"colon":"default","labelWidthType":"default","hiddenLabel":false,"visible":true,"hidden":false}]}}>
        <slots.content>
          <mybricks.normal-pc.${version}input-number data={{config:{"placeholder":"请输入语文成绩"}}} />
          <mybricks.normal-pc.${version}input-number data={{config:{"placeholder":"请输入数学成绩"}}} />
          <mybricks.normal-pc.${version}input-textarea data={{config:{"placeholder":"请输入评价内容"}}} />
        </slots.content>
      </mybricks.normal-pc.${version}form-container>
      \`\`\`
    </assistant_response>
  </example>
</examples>

# 注意
 - data.items每一项的id、comName保证唯一，禁止修改
`
  },
  getNewDSL(dsl) {
    const { data, slots } = dsl;
    if (slots && data.items) {
      const { content: slotContent } = slots;

      data.items.forEach((item, index) => {
        const com = slotContent.comAry[index]
        if (com) {
          com.id = item.id
          com.name = item.comName
        }
      })
    }

    return dsl;
  },
  execute(dsl, context) {
    const { data } = context;
    handleMerge(data, dsl.data);
  },
}
