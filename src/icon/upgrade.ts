import { Data } from './constants';

export default function ({ data, setDeclaredStyle, output, input }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 -> v1.0.4, 兼容图标颜色和尺寸
  */

  //兼容颜色和尺寸自定义情况
  if(data.size !== '' && data.color !== ''){
    setDeclaredStyle(`.icon`, { color: data.color, fontSize: data.size});
    data.color = '';
    data.size = '';
  }

  return true;
}