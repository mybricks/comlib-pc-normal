import { Data } from './constants';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  // /**
  //  * @description v1.0.0 -> v1.0.1, 新增标题和介绍文案字体样式大小
  // */
  // if (typeof data.size === "undefined") {
  //   data.size = "16px"
  // };

  //兼容之前颜色自定义情况
  if(data.isColor && data.textColor !== ''){
    if(data.textColor !== '#434343'){
      setDeclaredStyle(`.ant-alert-description`, { color: data.textColor});
    }
    data.textColor = '';
  }

  // /**
  //  * @description v1.0.3 -> v1.0.4, 兼容图标大小
  // */
  if(data.size && data.size !== ''){
    setDeclaredStyle(`.ant-alert-icon`, { fontSize: data.size});
    data.size = '';
  }
  
  return true;
}