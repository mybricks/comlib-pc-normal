import { OutputIds, SizeHeightMap } from './constants';
import { Data, SizeEnum, TypeEnum } from './types';

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
      item.outVal = "";
    };
    if (typeof item.inVal === "undefined") {
      item.inVal = ""
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
    if (item.style === undefined) {
      item.style = {
        height: 'auto',
        width: 'auto'
      };
    }

    /**
    * @description v1.0.9 style编辑器改造
    */
    if (item.style) {
      if (SizeHeightMap[item.size || SizeEnum.Middle] === item.style.height) {
        item.style.height = 'auto';
      }
      setDeclaredStyle(`div[data-btn-idx="${item.key}"]`, item.style);
      item.style = false;
    }


    /**
     * @description v1.0.13 「item style 配置项 => 风格」删除选项「危险按钮」，新增「item style 配置项 => 危险按钮」
     */
    if(item.type === TypeEnum.Danger) {
      item.type = TypeEnum.Primary;
      item.danger = true;
    }
  });

 

  return true;
}