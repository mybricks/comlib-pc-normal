import { Data } from './constants';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.0 -> v1.0.1, 新增标题和介绍文案字体样式大小
  */
  if (typeof data.size === "undefined") {
    data.size = "16px"
  };

  //兼容之前颜色自定义情况
  if(data.isColor){
    setDeclaredStyle(`.ant-alert-description`, { color: data.textColor});
  }
  
  return true;
}