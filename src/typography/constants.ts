import { CSSProperties } from 'react';
export type Align =
  | 'auto'
  | 'horizontal-start'
  | 'horizontal-center'
  | 'horizontal-end'
  | 'vertical-start'
  | 'vertical-center'
  | 'vertical-end';
export type TextType = 'secondary' | 'danger' | 'warning' | undefined;
export type Color = 'success' | 'processing' | 'error' | 'warning' | 'default';
export type Description = { label: string; key: string; value: any };
export interface Item {
  // 1 可视化配置 2 外部输入
  src: 1 | 2;
  key: string;
  type: 'Link' | 'Text' | 'Tag' | 'PicAndText' | 'Description';
  content: string | Description[];
  oldcontent: string | Description[];
  textType?: TextType;
  fontSize?: number;
  fontStyle?:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;
  color?: Color;
  title?: string;
  size?: 'default' | 'small' | 'middle';
  layout?: 'horizontal' | 'vertical';
  column?: number;
  stylePadding?: number[];
  style?: {
    [prop: string]: string | number;
  };
  click?: boolean;
  outputContent?: string;
  link?: string;
  useAppend?: boolean;
  align?: 'left' | 'center' | 'right';
  active?: boolean;
}
// 数据源
export interface Data {
  align: Align;
  margin: number;
  items: Item[];
  flexStyle?: any;
  style: CSSProperties;
  itemList: Item[];

  //是否统一样式
  isUnity: boolean;
  //统一间距
  padding: [number, number];
  //唯一标识
  rowKey: string;
}

const itemsSchema = {
  "type": "object",
  "properties": {
    "content": {
      "title": "内容",
      "type": "string",
      "description": "文本内容"
    },
    "type": {
      "title": "类型",
      "type": "string",
      "description": "可以为文本 'Text'、标签 'Tag'、链接'Link'"
    },
    "link": {
      "title": "链接",
      "type": "string",
      "description": "跳转链接，在类型为链接时有效"
    },
    "style": {
      "type": "object",
      "desc": "单个子项元素的样式",
      "properties": {
        "color": {
          "type": "string",
          "description": "文本颜色"
        },
        "fontSize": {
          "type": "string",
          "description": "字体大小"
        },
        "fontWeight": {
          "type": "number",
          "description": "文本粗细程度"
        },
        "stylePadding": {
          "type": "array",
          "description": "文本的内边距",
          "items": {
            "type": "number"
          }
        }
      }
    }
  }
}

export const descriptionUpList = [
  {
    type: 'input',
    id: 'setData',
    schema: {
      "type": "array",
      "description": "文本排版动态列表数据",
      "items": itemsSchema
    }
  },
  {
    type: 'output',
    id: 'click',
    schema: {
      "type": "object",
      "description": "单击后，获取的当前点击的文版排版的索引和数据",
      "properties": {
        "values": {
          "type": "object",
          "description": "当前点击项的数据内容",
          "properties": {
            "content": {
              "title": "内容",
              "type": "string",
              "description": "点击项的内容"
            },
            "key": {
              "title": "唯一标识",
              "type": "string",
              "description": "点击项唯一标识key"
            },
            "type": {
              "title": "类型",
              "type": "string",
              "description": "点击项的类型"
            },
            "link": {
              "title": "链接",
              "type": "string",
              "description": "点击项的链接，在类型为链接时，有效"
            }
          }
        },
        "index": {
          "description": "当前点击项的索引",
          "type": "number"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'setDataDone',
    schema: {
      "type": "array",
      "desc": "数组结构的文本排版数据格式",
      "items": itemsSchema
    }
  }
]