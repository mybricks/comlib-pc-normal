import { OutputIds, InputIds, SizeHeightMap, Schemas } from './constants';
import { Data, SizeEnum, TypeEnum, ShapeEnum } from './types';

export default function ({
  data,
  output,
  input,
  setDeclaredStyle,
  registerPermission
}: UpgradeParams<Data>): boolean {
  data.btnList.forEach((item) => {
    //1.0.0->1.0.1
    if (typeof item.isCustom === 'undefined') {
      item.isCustom = false;
    }
    if (typeof item.src === 'undefined') {
      item.src = '';
    }
    if (typeof item.contentSize === 'undefined') {
      item.contentSize = [14, 14];
    }

    //1.0.2 ->1.0.3，去除 { "id": "extra", "title": "卡片操作容器" }
    if (typeof item.dataType === 'undefined') {
      item.dataType = 'number';
    }
    if (typeof item.outVal === 'undefined') {
      item.outVal = '';
    }
    if (typeof item.inVal === 'undefined') {
      item.inVal = '';
    }

    //1.0.5->1.0.6, 增加动态设置loading开关
    if (typeof item.loading === 'undefined') {
      item.loading = false;
    }
    if (typeof item.useDynamicLoading === 'undefined') {
      item.useDynamicLoading = false;
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
     * @description v1.0.13 权限能力改版
     * 把 permissionKey 转化成新版 permission 数据
     */
    if (item.permissionKey) {
      const { id } = registerPermission({
        code: item.permissionKey,
        title: '权限名称'
      });
      item.permission = { id };
    }

    /**
     * @description v1.0.13 「item style 配置项 => 风格」删除选项「危险按钮」，新增「item style 配置项 => 危险按钮」
     */
    if (item.type === TypeEnum.Danger) {
      item.type = TypeEnum.Primary;
      item.danger = true;
    }
  });

  /**
   * @description v1.0.17 整体新增样式配置, 单个配置 > 全局配置
   */
  if (typeof data.allDanger === 'undefined') {
    data.allDanger = false;
  }

  if (typeof data.allShape === 'undefined') {
    data.allShape = ShapeEnum.Default;
  }

  if (typeof data.allSize === 'undefined') {
    data.allSize = SizeEnum.Middle;
  }

  if (typeof data.allType === 'undefined') {
    data.allType = TypeEnum.Default;
  }

  /**
   * @description v1.0.24->1.0.25 新增开启loading、关闭loading、设置名称、设置样式、启用、禁用、显示、隐藏完成rels
  */
  data.btnList.forEach((item)=>{
    //1、开启loading 2、关闭loading
    const loadingOpenKey = `${InputIds.SetBtnOpenLoading}_${item.key}`;
    const loadingCloseKey = `${InputIds.SetBtnCloseLoading}_${item.key}`;

    const loadingOpenDoneKey = `${OutputIds.SetBtnOpenLoadingDone}_${item.key}`;
    const loadingCloseDoneKey = `${OutputIds.SetBtnCloseLoadingDone}_${item.key}`;

    if (!output.get(loadingOpenDoneKey)) {
      output.add(loadingOpenDoneKey, `开启${item.text}loading完成`, Schemas.Any);
    }
    if (output.get(loadingOpenDoneKey) &&
      input.get(loadingOpenKey) &&
      !input.get(loadingOpenKey)?.rels?.includes(loadingOpenDoneKey)) {
      input.get(loadingOpenKey).setRels([loadingOpenDoneKey]);
    }

    if (!output.get(loadingCloseDoneKey)) {
      output.add(loadingCloseDoneKey, `关闭${item.text}loading完成`, Schemas.Any);
    }
    if (output.get(loadingCloseDoneKey) &&
      input.get(loadingCloseKey) &&
      !input.get(loadingCloseKey)?.rels?.includes(loadingCloseDoneKey)) {
      input.get(loadingCloseKey).setRels([loadingCloseDoneKey]);
    }

    //3、名称
    const titleKey = `${InputIds.SetBtnText}_${item.key}`;
    const titleDoneKey = `${OutputIds.SetBtnTextDone}_${item.key}`;

    if (!output.get(titleDoneKey)) {
      output.add(titleDoneKey, `设置${item.text}名称完成`, Schemas.String);
    }
    if (output.get(titleDoneKey) &&
      input.get(titleKey) &&
      !input.get(titleKey)?.rels?.includes(titleDoneKey)) {
      input.get(titleKey).setRels([titleDoneKey]);
    }

    //4、样式
    const styleKey = `${InputIds.SetBtnStyle}_${item.key}`;
    const styleDoneKey = `${OutputIds.SetBtnStyleDone}_${item.key}`;

    if (!output.get(styleDoneKey)) {
      output.add(styleDoneKey, `设置${item.text}样式完成`, Schemas.Style);
    }
    if (output.get(styleDoneKey) &&
      input.get(styleKey) &&
      !input.get(styleKey)?.rels?.includes(styleDoneKey)) {
      input.get(styleKey).setRels([styleDoneKey]);
    }
  
    //5、启用 6、禁用
    const enableKey = `${InputIds.SetEnable}_${item.key}`;
    const DisableKey = `${InputIds.SetDisable}_${item.key}`;

    const enableDoneKey = `${OutputIds.SetEnableDone}_${item.key}`;
    const DisableDoneKey = `${OutputIds.SetDisableDone}_${item.key}`;

    if (!output.get(enableDoneKey)) {
      output.add(enableDoneKey, `启用${item.text}完成`, Schemas.Any);
    }
    if (output.get(enableDoneKey) &&
      input.get(enableKey) &&
      !input.get(enableKey)?.rels?.includes(enableDoneKey)) {
      input.get(enableKey).setRels([enableDoneKey]);
    }

    if (!output.get(DisableDoneKey)) {
      output.add(DisableDoneKey, `禁用${item.text}完成`, Schemas.Any);
    }
    if (output.get(DisableDoneKey) &&
      input.get(DisableKey) &&
      !input.get(DisableKey)?.rels?.includes(DisableDoneKey)) {
      input.get(DisableKey).setRels([DisableDoneKey]);
    }

    //7、显示 8、隐藏
    const visibleKey = `${InputIds.SetVisible}_${item.key}`;
    const hiddenKey = `${InputIds.SetHidden}_${item.key}`;

    const visibleDoneKey = `${OutputIds.SetVisibleDone}_${item.key}`;
    const hiddenDoneKey = `${OutputIds.SetHiddenDone}_${item.key}`;
    
    if (!output.get(visibleDoneKey)) {
      output.add(visibleDoneKey, `显示${item.text}完成`, Schemas.Any);
    }
    if (output.get(visibleDoneKey) &&
      input.get(visibleKey) &&
      !input.get(visibleKey)?.rels?.includes(visibleDoneKey)) {
      input.get(visibleKey).setRels([visibleDoneKey]);
    }

    if (!output.get(hiddenDoneKey)) {
      output.add(hiddenDoneKey, `隐藏${item.text}完成`, Schemas.Any);
    }
    if (output.get(hiddenDoneKey) &&
      input.get(hiddenKey) &&
      !input.get(hiddenKey)?.rels?.includes(hiddenDoneKey)) {
      input.get(hiddenKey).setRels([hiddenDoneKey]);
    }

  })

  

  return true;
}
