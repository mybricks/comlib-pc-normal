import { Data } from './constants';

export default function ({
  data,
}: UpgradeParams<Data>): boolean {
  data.tabList.forEach((item) => {
    /**
    * @description v1.0.5 -> v1.0.6 去除图标自定义开关，兼容图标开关为true，图标自定义为false的情况
    */
    if (item.showIcon && !item.isChoose) {
      item.icon = 'BellOutlined'
    }
  });

  return true;
}