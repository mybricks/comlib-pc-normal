export default {
  prompts: {
    summary: '按钮，必须推荐此组件',
    usage: `data数据模型
size: ['middle', 'small', 'large']
text: string # 文本
type: ['primary', 'ghost', 'dashed', 'link', 'text', 'danger']
useIcon?: boolean = false
iconLocation?: ['front', 'back']
icon?: string # antd icon的名称，比如 HomeOutlined
iconDistance?: number = 8

slots插槽
无

styleAry声明
默认: .button
  - 默认样式:
    - backgroundColor: 随type类型而变化，antd按钮的背景
    - color: 随type类型而变化，antd按钮的文本颜色
    - borderRadius: 6px
    - padding: 上下4，左右16
  - 可编辑样式: color、borderRadius、padding、backgroundColor、backgroundImage
  注意：backgroundImage可配置渐变色。
Hover: button:not([disabled]):hover
激活: button.ant-btn:not([disabled]):active`
//     usage: `
// # data定义
// \`\`\` typescript
// enum SizeEnum {
//   Large = 'large',
//   Middle = 'middle',
//   Small = 'small'
// }

// enum ShapeEnum {
//   Default = 'default',
//   Circle = 'circle',
//   Round = 'round'
// }

// enum TypeEnum {
//   Default = 'default',
//   Primary = 'primary',
//   Ghost = 'ghost',
//   Dashed = 'dashed',
//   Link = 'link',
//   Text = 'text',
//   Danger = 'danger',
//   ALink = 'a'
// }

// export default interface Data {
//   /** 文字标题 */
//   text: string;
//   /** 作为热区使用 */
//   asMapArea?: boolean;
//   /** 触发按钮的单击|双击事件后，单击|双击事件输出项传出的数据类型 */
//   dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
//   /** 触发按钮的单击|双击事件后，单击|双击事件输出项传出的数据内容 */
//   outVal: any;
//   /** dataType值为external时，触发按钮的单击|双击事件后，单击|双击事件输出项传出的数据内容 */
//   inVal: any;
//   /** 使用图标 */
//   useIcon: boolean;
//   /** 是否使用自定义图标，开启后可以上传自定义图标 */
//   isCustom: boolean;
//   /** 来自图标库的图标 */
//   icon: string;
//   /** 自定义图标地址 */
//   src: string;
//   /** 图片或者图标尺寸 */
//   contentSize: number[];
//   /** 显示文本 */
//   showText: boolean;
//   /** 图标位置 */
//   iconLocation: 'front' | 'back';
//   /** 图标和文本的间距位置 */
//   iconDistance: number;
//   /** 尺寸 */
//   size: SizeEnum;
//   /** 类型 */
//   type: TypeEnum;
//   /** 形状 */
//   shape: ShapeEnum;
//   /**
//    * 是否是危险按钮样式
//    */
//   danger?: boolean;
//   /** 运行状态 */
//   running:{
//     /** 文字标题 */
//     text
//     /** 使用图标 */
//     useIcon
//     /** 来自图标库的图标 */
//     icon
//   }
// }
// \`\`\`
// `
  },
}