import { ImageProps } from "antd";
import { getPropsFromObject } from "../utils/toReact";
import { Data } from "./constants";

export default function ({ data }: RuntimeParams<Data>) {

    const str = getSingleImageStr({ data });

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Image']
            },
            {
                from: 'antd/dist/antd.css',
                coms: []
            },
        ],
        jsx: str,
        style: '',
        js: ''
    }
}

/**
 * 获取图片codeStr
 * @param env 
 */
const getSingleImageStr = ({ data }: { data: Data }) => {
    const { alt, src, customStyle, useFallback, fallbackImgSrc, usePreview, previewImgSrc } = data;
    const { styleEditorUnfold, ...style } = customStyle || {};

    const imageProps: ImageProps = {
        alt,
        src,
        width: '100%',
        height: '100%',
        style,
        fallback: (useFallback && fallbackImgSrc) ? fallbackImgSrc : undefined,
        preview: usePreview ? { src: previewImgSrc || src } : false,
        // onClick
    };

    return `<Image
                ${getPropsFromObject(imageProps)}
            />`
}