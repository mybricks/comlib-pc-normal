import React from 'react';
import { SpaceProps, TagProps } from 'antd';

export type TagSize = 'small-tag' | 'middle-tag' | 'large-tag';

export type Preset = 'default' | 'processing' | 'error' | 'warning' | 'success';

export interface Tag extends TagProps {
  key: string;
  icon?: string;
  content: React.ReactElement | string;
  checked?: boolean;
  textColor?: string;
  borderColor?: string;
}

interface AppendBtn extends TagProps {
  text: string
}

export interface Data extends SpaceProps {
  type: Preset;
  tags: Array<Tag>;
  dynamic?: boolean;
  appendAble?: boolean;
  useAppendBtn?: boolean;
  checkable?: boolean;
  tagSize: TagSize;
  isEllipsis: boolean,
  ellipsis: {
    maxWidth: number,
  }
  tagStyle: Partial<{
    color: string;
    borderColor: string;
    textColor: string;
  }>;
  closeAble: boolean
  appendBtn: AppendBtn
}
