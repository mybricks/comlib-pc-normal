import { message } from "antd";

export interface Data {
  eventType: string;
  eventInputs: any[];
}

export enum InputIds {
  INPUT = 'input',
  RUN = 'input.run'
}

// 可用于测试
export const events = [
  {
    type:'pushStae',
    title: '路由跳转',
    default: false,
    exe({ options }) {
      message.info(`路由跳转:${options.url}`)
    },
    options: [
      {
        id: 'url',
        title: '地址',
        editor: 'textarea'
      },
      {
        id: 'url1',
        title: '地址1',
        editor: 'textarea1'
      }
    ]
  },
  {
    type:'openWindow',
    title: '打开新窗口',
    default: false,
    exe({ options }) {
      message.info(`打开新窗口:${options.url}`)
    },
    options: [
      {
        id: 'url',
        title: '地址',
        editor: 'textarea'
      }
    ]
  }
]