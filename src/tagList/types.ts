import React from "react"
import { SpaceProps, TagProps } from 'antd';

export type TagSize = 'small-tag' | 'middle-tag' | 'large-tag'
 
export interface Tag extends TagProps {
  key: string
  icon?: string
  content: React.ReactElement | string
  checkable?: boolean
  checked?: boolean
}

export interface Data extends SpaceProps {
  tags: Array<Tag>
  dynamic?: boolean
  tagSize: TagSize
}
