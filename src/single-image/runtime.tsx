import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'antd'
import { Data, ImageItem } from './constants'

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const setImage = useCallback((ds) => {
    data.image = {
      ...data.image,
      src: ds,
    }
  }, [])

  const onClick = useCallback(() => {
    outputs['click'] && outputs['click']()
  }, [])

  useEffect(() => {
    if (env.runtime) {
      inputs['imgSrc'] && inputs['imgSrc'](setImage)
      inputs['slotProps'] && inputs['slotProps'](setImage)
    }
  }, [])

  return <ImgRender item={data.image} env={env} onClick={onClick} />
}

// 单图片渲染
export function ImgRender({
  item,
  env,
  onClick,
}: {
  item: ImageItem
  env: any
  onClick?: any
}) {
  const {
    alt,
    src,
    fallback,
    placeholder,
    preview,
    customBorderStyle,
    supportFallback,
    cursorStyle,
  } = item

  return (
    <Image
      alt={alt}
      src={src}
      width="100%"
      height="100%"
      style={{
        ...customBorderStyle,
        cursor: cursorStyle ? 'pointer' : 'unset',
      }}
      fallback={supportFallback ? fallback : ''}
      placeholder={placeholder}
      preview={env.runtime && preview}
      onClick={preview ? null : onClick}
    />
  )
}
