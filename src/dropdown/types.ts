export interface Data {
    options: { label: string, value: any, disabled?: boolean, useIcon:boolean, icon: string, iconColor: string, link: string, key: string }[],
    placement: "bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topCenter",
    width: number | string,
    isCustom: boolean,
    content: string,
    trigger: "hover" | "click",
    isChildCustom: boolean,
    isDynamic: boolean,
    dynamicOptions: any[],
    eventBubble: boolean,
    contentBubble: boolean,
    isItem: boolean
}

export const onClickSchema = {
  type: "object",
  properties: {
    label: {
      type: "string",
      description: "点击项标签"
    },
    link: {
      type: "string",
      description: "点击项链接"
    },
    key: {
      type: "string",
      description: "点击项唯一标识"
    }
  }
}
export const dynamicOnClickSchema = {
  type: "object",
  properties: {
    value: {
      type: "any",
      description: "传递值"
    },
    disabled: {
      type: "boolean",
      description: "是否禁用"
    }
  }
}