import { getPropsFromObject } from "../utils/toReact";
import { Data } from "./constants";

export default function ({ data }: RuntimeParams<Data>) {
    const str = getMultiImageStr({ data });
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

const getMultiImageStr = ({ data }: { data: Data }) => {
    const { images = [], layout, columns, gap, objectFit, useFallback, fallbackImgSrc, usePreview } = data;

    const containerStyle = {
        display: layout === 'grid' ? 'grid' : 'flex',
        flexWrap: layout === 'flex' ? 'wrap' : undefined,
        gridTemplateColumns: layout === 'grid' ? `repeat(${columns || 3}, 1fr)` : undefined,
        gap: `${gap || 0}px`,
        width: '100%',
        height: '100%'
    };

    const imageStyle = {
        objectFit: objectFit || 'cover',
        width: '100%',
        height: '100%'
    };

    const imageList = images.map((item) => {
        const props: any = {
            alt: item.alt || '',
            src: item.src,
            style: imageStyle,
            fallback: (useFallback && fallbackImgSrc) ? fallbackImgSrc : undefined,
            preview: usePreview ? { src: item.previewImgSrc || item.src } : false
        };
        return `<div className="mult-image-item">\n              <Image ${getPropsFromObject(props)} />\n            </div>`;
    }).join('\n');

    return `<div style={${JSON.stringify(containerStyle)}} className="mult-image-contain">\n${imageList}\n</div>`;
}
