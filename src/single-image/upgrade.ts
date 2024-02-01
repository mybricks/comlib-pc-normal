import { Data, InputIds } from './constants';
import { isEmptyObject } from '../utils'

export default function ({
    data,
    input,
    output,
    setDeclaredStyle
}: UpgradeParams<Data>): boolean {
    if (data.usePreview && !input.get(InputIds.SetPreviewImgSrc)) {
        input.add(InputIds.SetPreviewImgSrc, '预览图片地址', { type: 'string' });
    }
    //1.0.3 -> 1.0.4, 兼容图片边框
    if(data.customStyle && !isEmptyObject(data.customStyle)){
      setDeclaredStyle(`.ant-image-img`, data.customStyle);
      data.customStyle = {}
    }

    /**
    * @description v1.0.8 -> v1.0.9, 增加设置图片地址，预览地址
    */
    if (!output.get("setImgSrcDone")) {
      output.add("setImgSrcDone", '设置地址完成', { type: 'string' });
    }
    if (output.get("setImgSrcDone") &&
      input.get("setImgSrc") &&
      !input.get("setImgSrc")?.rels?.includes("setImgSrcDone")) {
      input.get("setImgSrc").setRels(["setImgSrcDone"]);
    }

    if(data.usePreview && !output.get("setPreviewImgSrcDone") && input.get(InputIds.SetPreviewImgSrc)){
      output.add("setPreviewImgSrcDone", '设置预览地址完成', { type: 'string' });
      input.get(InputIds.SetPreviewImgSrc).setRels(["setPreviewImgSrcDone"]);
    }

    return true;
}