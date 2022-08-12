import React from 'react';
import { Image } from 'antd';
import { IColumn } from '../../types';

interface Props {
  value: any;
  record: any;
  columnItem: IColumn;
}

// 模版替换 {id}
function getTemplateHref(template: string, source: any) {
  return template
    .replace(/\{(.*?)\}/g, (match, key) => source[`${key}`.trim()])
    .trim();
}
const ImageRender = (props: Props): JSX.Element => {
  const { value, record, columnItem } = props;
  const { imageConfig, width: colWidth } = columnItem;
  const {
    width,
    height,
    preview,
    fallback,
    useCustomSrc,
    customSrc,
    usePlaceholder,
    placeholderSourceType,
    placeholderRowKey,
    placeholderHref
  } = imageConfig || {};

  const PlaceholderRender = () => {
    if (!usePlaceholder) {
      return;
    }
    let placeholderSrc;
    switch (placeholderSourceType) {
      case 'rowKey':
        placeholderSrc = record[placeholderRowKey];
        break;
      case 'href':
        placeholderSrc = getTemplateHref(placeholderHref, record);
        break;
    }
    return (
      <Image
        width={width || colWidth || undefined}
        height={height || undefined}
        preview={false}
        src={placeholderSrc}
        fallback={fallback || undefined}
      />
    );
  };

  const src =
    useCustomSrc && customSrc ? getTemplateHref(customSrc, record) : value;

  return (
    <Image
      width={width || colWidth || undefined}
      height={height || undefined}
      preview={preview}
      src={src}
      fallback={fallback || undefined}
      placeholder={<PlaceholderRender />}
    />
  );
};

export default ImageRender;
