import React from "react"
import { SpaceProps, TagProps } from 'antd';
 
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
}
