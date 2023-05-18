import React from 'react';
import { SpaceProps, TagProps } from 'antd';

export type TagSize = 'small-tag' | 'middle-tag' | 'large-tag';
export interface Tag extends TagProps {
  key: string;
  icon?: string;
  content: React.ReactElement | string;
  checkable?: boolean;
  checked?: boolean;
  textColor?: string;
  borderColor?: string;
}

export interface Data extends SpaceProps {
  tags: Array<Tag>;
  dynamic?: boolean;
  canInsert?: boolean;
  tagSize: TagSize;
  tagStyle: Partial<{
    color: string;
    borderColor: string;
    textColor: string;
  }>;
}
