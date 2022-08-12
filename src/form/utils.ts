import { Data } from './runtime'
import { FormItemType } from './type'

function getOtherParamsValues (otherParams: any[]) {
  const paramsValue = {}
  otherParams.map(item => {
    paramsValue[item.name] = item.value
  })
  return paramsValue
}

function getFieldItemIndex(focusArea: any): number {
  const index = ~~focusArea.dataset.fieldItemIndex
  return index
}

function getFormItemIndex(focusArea: any): number {
  const index = ~~focusArea.dataset.formItemIndex
  return index
}

function getFormItemType(focusArea): FormItemType {
  const itemType = focusArea.dataset.formItemType
  return itemType
}

const defaultValidatorAnnotation = `/**
* interface Option {
*   label: string;
*   value: string;
*   children?: Option[];
*   key: string | number;
*   disabled?: boolean;
* }
* interface formItemProps {
*   value: string; 
*   label: string; 
*   name: string; 
*   visible: boolean;
*   disabled: boolean;
*   allowClear?: boolean;
*   placeholder: string;
*   isRequired: boolean;
*   options: Option[];
*   addonBefore?: string;
*   addonAfter?: string;
*   onChange?: (val: any) => void;
*   onChange?: (val: any) => void;
* }
* interface Utils {
*   moment: (params:any) => any;
*   lodash: (params:any) => any;
*   isEmailPrefix: (str: string) => boolean;
*   isCommaNumber: (str: string) => boolean;
*   numToPercent: (str: string) => string;
*   isNumber: (str: string) => boolean;
*   isUrl: (str: string) => boolean;
* }
* interface contextProps {
*  setFormParams: ({[key: string]: any}) => void 设置表单扩展参数
*  getFieldValue: (fieldName: stirng) => string | numer 获取表单项值
*  setFromItemDesc: ({[key: string]: any}) => void 设置表单项描述
*  success: () => void 校验成功后执行的函数
*  failed: (msg: string) => void 校验失败后显示的错误信息
*  callService: (serviceId: string, params: Object) => Promise<any>
* }
*
* @param model: {
*  curFormItem: formItemProps 当前表单项
*  curValue: any 当前表单项的值
*  formItems: [{
*     [key: string]: formItemProps
*   }]
*  utils: Utils
*  params: {[key: string]: any}
* }
* @param context: contextProps
*/
`

const defaultValidatorExample = `
export default async function (model, context) {
  const item = model.curFormItem;
  if (!model.curValue) {
    context.failed(\`\${item.label}不能为空\`)
  } else {
    context.success();
  }
}
`
const defaultFormJSComments = `/**
* interface Option {
*   label: string;
*   value: string;
*   children?: Option[];
*   key: string | number;
*   disabled?: boolean;
* }
* interface formItemProps {
*   value: string; 
*   label: string; 
*   name: string; 
*   visible: boolean;
*   disabled: boolean;
*   allowClear?: boolean;
*   placeholder: string;
*   isRequired: boolean;
*   options: Option[];
*   addonBefore?: string;
*   addonAfter?: string;
*   onChange?: (val: any) => void;
*   onChange?: (val: any) => void;
* }
* interface contextProps {
*  // 发送网络请求
*  callService: (serviceId: string, params: Object) => Promise<any>
* }
* interface Utils {
*   moment: (params:any) => any;
*   lodash: (params:any) => any;
*   isEmailPrefix: (str: string) => boolean;
*   isCommaNumber: (str: string) => boolean;
*   numToPercent: (str: string) => string;
*   isNumber: (str: string) => boolean;
*   isUrl: (str: string) => boolean;
* }
* @param model: {
*   formItems: [{
*     [key: string]: formItemProps;
*   }];
*   utils: Utils 
*   params: {[key: string]: any};
* }
* @param context: contextProps
*
* @example
* export default async function (model, context) {
*  const item = model.formItems['name'];
*  const item1 = model.formItems['name1'];
*  const item3 = model.formItems['name3'];
*  
*  item.onChange = function (val) {
*     // 设置表单项的显隐 隐藏后不提交该项数据
*     if (val === 'test') {
*       item1.visible = false
*     } else {
*       item1.visible = true
*     }
*     // 设置表单项的显隐 隐藏后提交该项数据
*     if (val === 'test') {
*       item1.hidden = true
*     } else {
*       item1.hidden = false
*     }
*
*     // 设置其他表单项的值
*     const value = item.value;
*     item1.value = value + 1;
*
*     // 发网络请求
*     const serviceId = 123;
*     const data = await context.callService(serviceId, { type: 1, name: 'test'})
*   }
*
*  // 扩展参数
*  if (model.params.disabled) {
*   item3.disabled = true;
*  } else {
*   item3.disabled = false;
*  }
* }
*/
`

const defaultFormJSExample = `export default async function (model, context) {

}`
const defaultCommentTrans = `/**
参数remoteData是接口返回的数据，可编写代码对其作数据格式转换处理
挂载在formItem.options上的参数将作为select的选项, 类型为{label: string, value: string}[]
例: formItem.options = remoteData
*/
`

const defaultTransOptScript = `export default async function transform(formItem, remoteData) {
   
}`

const buttonTypeOptions = [
  {value: 'default', label: '默认'},
  {value: 'primary', label: '主按钮'},
  {value: 'dashed', label: '虚线按钮'},
  {value: 'link', label: '链接按钮'},
  {value: 'text', label: '文字按钮'},
]

function getLabelCol (data: Data) {
  const labelCol = data.labelWidthType === 'span' 
  ? { span: 24 - data.wrapperCol }
  : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}

function getWrapperCol (data: Data) {
  const wrapperCol = { span: data.wrapperCol, offset: 24 - data.wrapperCol }

  return wrapperCol
}

function getValueIndex (value: any[]) {
  return value.findIndex(item => item)
}

function checkItemType (types: FormItemType[], type: FormItemType) {
  return types.includes(type)
}

function getRadioKey(focusArea): string {
  const radioKey = focusArea.dataset.formItemRadioKey
  return radioKey
}


function getCompositionItemIndex (focusArea) {
  const index = ~~focusArea.dataset.formCompositionItemIndex
  return index
}

function getCompositionItems (data: Data, focusArea) {
  const index = getFormItemIndex(focusArea)
  const formItem = data.formItems[index]
  const itemType = getFormItemType(focusArea)
  const radioKey = getRadioKey(focusArea)
  let compositionItems = formItem.compositionItems

  if (itemType === 'radio') {
    if (typeof formItem.radioCompositionItems === 'undefined') {
      formItem.radioCompositionItems = {}
    }
    compositionItems = formItem.radioCompositionItems[radioKey]
  }
  return compositionItems
}

function getCompositionItem (data: Data, focusArea) {
  const compositionItems = getCompositionItems(data, focusArea)
  const compositionItem = compositionItems && compositionItems[getCompositionItemIndex(focusArea)]

  return compositionItem
}

const getFormItem = (data: Data, name: string) => {
  const item = data.formItems.find((item) => item.name === name);
  return item;
};


enum RuleKeys {
  REQUIRED = 'required',
  MIN = 'min',
}

// 校验规则函数映射
const ruleFnMap = {
  [RuleKeys.REQUIRED]: ({ label, content, messageFn }) => {
    if (!content) {
      return messageFn(`${label}不能为空`);
    }
    return 'success';
  },
  [RuleKeys.MIN]: ({ label, content, minLen, messageFn, success }) => {
    if (!content || content.length < minLen) {
      return messageFn(`${label}的长度不能小于${minLen}`);
    }
    return 'success';
  },
};

// 随机字母/数字
function randomStr() {
  const seed = 'abcdefhijkmnprstwxyz0123456789';
  const maxPos = seed.length;
  return seed.charAt(Math.floor(Math.random() * maxPos));
}
// 文件名不能有中文
// 长度为 1 ~ 255个字符，只能包含数字 [0-9] 英文字母 [a-zA-Z] 中划线 - 下划线 _ 波浪线 ~ 点 .
// 开头不能是中划线 -， 点.
function formatFileName(fileName) {
  const fileNameRegExp1 = /[0-9a-zA-Z_~]/;
  const fileNameRegExp2 = /[0-9a-zA-Z_~\-\.]/;
  return fileName
    .split('')
    .reverse()
    .slice(0, 255)
    .reverse()
    .map((str, idx) => {
      if (
        (idx === 0 && fileNameRegExp1.test(str)) ||
        (idx !== 0 && fileNameRegExp2.test(str))
      ) {
        return str;
      }
      return randomStr();
    })
    .join('');
}

function getDefaultGroupStyle() {
  return {
    fontWeight: 'normal',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 1,
    color: '#1f1f1f'
  }
}

export {
  getOtherParamsValues,
  getFieldItemIndex,
  getFormItemIndex,
  getFormItemType,
  defaultValidatorAnnotation,
  defaultValidatorExample,
  defaultFormJSComments,
  defaultTransOptScript,
  defaultCommentTrans,
  defaultFormJSExample,
  buttonTypeOptions,
  getLabelCol,
  getWrapperCol,
  getValueIndex,
  checkItemType,
  getRadioKey,
  getDefaultGroupStyle,
  getCompositionItemIndex,
  getCompositionItems,
  getCompositionItem,
  getFormItem,
  RuleKeys,
  ruleFnMap
}