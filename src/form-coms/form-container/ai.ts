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
import { FormProps, ButtonProps } from 'antd'

interface Action {
  title: string
  loading?: boolean
  isDefault: boolean
  outputId: string
  type?: ButtonProps['type']
  key: string
  visible?: boolean
  danger?: boolean
  permission?: {
    id: string
    type?: string
  },
  useDynamicHidden: boolean;
  useDynamicDisabled: boolean;
  disabled: boolean;
  useIcon: boolean;
  iconLocation: 'front' | 'back';
  icon: string;
  iconDistance: number;
}

interface Actions {
  items: Action[];
  widthOption: LabelWidthType;
  width: number;
  span: number;
  visible: boolean;
  align: 'left' | 'center' | 'right';
  inlinePadding?: number[]
}

interface FormItems {
  id: string;
  comName: string
  name: string
  label: string
  span: number
  required?: boolean
  colon?: FormItemColonType
  visible: boolean
  validateStatus?: string
  help?: string
  tooltip?: string
  labelStyle?: {}
  labelWidthType?: 'custom' | 'default'
  labelWidth?: number
  labelAlign?: 'left' | 'right' | 'default'
  labelAutoWrap?: boolean | 'default'
  hiddenLabel?: boolean
  description?: string
  descriptionStyle?: {}
  widthOption: LabelWidthType
  width: number
  inlineMargin?: number[]
  slotAfter?: string
  disabled?: boolean
  /** 表单项收起时隐藏，不影响提交数据 */
  hidden?: boolean
  labelSlot?: string
  /** 单个表单项，过长配置 */
  ellipseMode?: 'wrap' | 'ellipse' | 'default'
}

interface AdditionalItem {
  id: string;
  comName: string
  name: string
  span: number
  widthOption: LabelWidthType
  width: number
  visible: boolean
}

type LabelWidthType = 'px' | 'span' | 'flexFull'

interface DomainModel {
  entity?: any
  queryFieldRules: QueryFieldRules
  isQuery?: boolean
  type?: string
}

interface QueryFieldRules {
  [field: string]: {
    operator: string
  }
}

interface MobileFormConfig {
  /** 默认开启，小尺寸 antd 内置的表单项、标题 的换行样式生效 */
  enableWidthAdaptive?: boolean
}

type FormItemColonType = true | false | "default";

export default interface Data {
  /**
   * 表单类型 普通表单、查询表单
   */
  layoutType: 'Form' | 'QueryFilter'
  /**
   * 表单项列表
   */
  items: FormItems[]
  /**
   * 非表单项列表
   */
  additionalItems: AdditionalItem[]
  /**
   * 是否作为表单项
   */
  isFormItem: boolean
  /**
   * 单行列数
   */
  formItemColumn: number
  /**
   * 启用24栅格布局，启用后，可设置表单项宽度；查询表单使用
   */
  enable24Grid?: boolean
  /**
   * 布局类型
   */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /**
   * 操作项
   */
  actions: Actions
  /**
   * 标题宽度类型
   */
  labelWidthType: LabelWidthType
  /**
   * 标题宽度
   */
  labelWidth: number
  /**
   * 标题宽度占比
   */
  labelCol: number
  wrapperCol: number
  /**
   * 标题是否展示冒号
   */
  colon: boolean | undefined
  /**
   * 表单原生属性
   */
  config: FormProps
  /**
   * 移动端配置
   */
  mobileConfig: MobileFormConfig
  /**
   * 表单项可编辑/只读
   */
  isEditable: boolean
  /**
   * 合并参数 Schema
   */
  paramsSchema: any
  /**
   *  提交隐藏表单项
   */
  submitHiddenFields: boolean
  /**
   *  隐藏表单项字段是否校验
   */
  validateHiddenFields: boolean
  /**
   *  绑定的领域模型数据
   */
  domainModel: DomainModel
  /**
   * 表单项 24栅格宽度
   */
  span?: number
  /*
   * 默认状态下是否折叠超出的表单项
   */
  defaultCollapsed: boolean
  ellipseMode?: 'wrap' | 'ellipse' | 'default'
  /** 开启动态设置表单项 */
  useDynamicItems?: boolean
  /**  动态设置的依赖的原始模板表单项列表 */
  originItems: FormItems[]
  /** 展开文案 */
  expandText?: string
  /** 收起文案 */
  collapsedText?: string
  /** 列间距 */
  columnGap?: number
  /** 领域模型 */
  _domainModel?: any;
}
\`\`\`

# slots定义
| id | type | description |
|------|--------|--------|
| content | scope | 内容区插槽 |

# styleAry定义
无

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
    `
  },
  getNewDSL(dsl) {
    const { data, slots } = dsl;
    const { content: slotContent } = slots;

    data.items.forEach((item, index) => {
      const com = slotContent.comAry[index]
      if (com) {
        item.id = com.id
        item.comName = com.name
      }
    })

    return dsl;
  },
  execute(dsl, context) {
    const { data } = context;
    handleMerge(data, dsl.data);
  },
}