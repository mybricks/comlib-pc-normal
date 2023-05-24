import { CSSProperties } from 'react';
import { OutputIds, SizeHeightMap } from './constants';
import { Data, SizeEnum } from './types';

export default function ({
  data,
  output,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  data.btnList.forEach((item) => {
    //1.0.0->1.0.1
    if (typeof item.isCustom === 'undefined') {
      item.isCustom = false;
    }
    if (typeof item.src === 'undefined') {
      item.src = ""
    }
    if (typeof item.contentSize === 'undefined') {
      item.contentSize = [14, 14];
    }

    //1.0.2 ->1.0.3，去除 { "id": "extra", "title": "卡片操作容器" }
    if (typeof item.dataType === "undefined") {
      item.dataType = "number";
    };
    if (typeof item.outVal === "undefined") {
      item.outVal = 0;
    };
    if (typeof item.inVal === "undefined") {
      item.outVal = "";
    }

    //1.0.5->1.0.6, 增加动态设置loading开关
    if (typeof item.loading === 'undefined') {
      item.loading = false
    }
    if (typeof item.useDynamicLoading === 'undefined') {
      item.useDynamicLoading = false
    }

    /**
     * @description v1.0.5 , fix setSchema问题
     */
    if (typeof item.dataType === 'number') {
      const click = output.get(item.key);
      const dbClick = output.get(`${OutputIds.DoubleClick}_${item.key}`);
      click.setSchema({
        type: 'number'
      });
      dbClick.setSchema({
        type: 'number'
      });
    }

    /**
    * @description v1.0.8 增加宽高配置
    */
    if (!item.style) {
      item.style = {
        height: SizeHeightMap[item.size || SizeEnum.Middle],
        width: 'auto'
      }
    }

    /**
    * @description v1.0.9 style编辑器改造
    */
    if (item.style) {
      // 注：padding需要根据size动态生成
      // let padding = ['4px', '4px', '15px', '15px'];
      // if (item.size === 'large') {
      //   padding = ['6.4px', '6.4px', '15px', '15px'];
      // }
      // if (item.size === 'small') {
      //   padding = ['0', '0', '7px', '7px'];
      // }

      const initStyle: CSSProperties = {
        ...item.style,
        // textAlign: 'center',
        // fontSize: item.size === 'large' ? '16px' : '14px',
        // fontWeight: 400,
        // boxShadow: '0 2px 0 rgba(0,0,0,.015)',
        // paddingTop: padding[0],
        // paddingBottom: padding[1],
        // paddingLeft: padding[2],
        // paddingRight: padding[3],
        // borderRadius: '2px',
      }
      setDeclaredStyle(`div[data-btn-idx="${item.key}"]`, initStyle)
    }

  })

  return true;
}