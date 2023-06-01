import { Data, InputIds } from './constants';

export default function ({
    data,
    input,
    setDeclaredStyle
}: UpgradeParams<Data>): boolean {
    if (data.usePreview && !input.get(InputIds.SetPreviewImgSrc)) {
        input.add(InputIds.SetPreviewImgSrc, '预览图片地址', { type: 'string' });
    }
    //1.0.3 -> 1.0.4, 兼容图片边框
    if(data.customStyle){
      setDeclaredStyle(`.ant-image-img`, data.customStyle);
    }
    return true;
}