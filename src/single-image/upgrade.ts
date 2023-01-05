import { Data, InputIds } from './constants';

export default function ({
    data,
    input,
}: UpgradeParams<Data>): boolean {
    if (data.usePreview && !input.get(InputIds.SetPreviewImgSrc)) {
        input.add(InputIds.SetPreviewImgSrc, '预览图片地址', { type: 'string' });
    }
    return true;
}