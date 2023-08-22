import { Data } from "./types";

export default function ({ data, input, output, slot }: UpgradeParams<Data>): boolean {

  /**
     * @description v1.0.7 , 作用域支持添加自定义内容项组件
     */
  console.log(data.additionalItems, 'before')
  if (!data.additionalItems) data.additionalItems = [];
  console.log(data.additionalItems, 'after')
  slot.get('formItems').setSchema([
    "mybricks.normal-pc.form-container/form-item",
    "mybricks.normal-pc.form-container/form-addition-container"
  ]);
  //=========== v1.0.7 end ===============

  return true;
}