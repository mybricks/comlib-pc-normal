/** @format */

import { Data, Status } from './runtime';

interface Result {
  data: Data;
  focusArea: any;
  output: any;
  input: any;
  slot: any;
}

export default {
  '@resize': {
    options: ['width']
  },
  ':root': [
    {
      title: '标题',
      type: 'Text',
      options: {
        locale: true
      },
      value: {
        get({ data }: Result) {
          return data.title;
        },
        set({ data }: Result, value: string) {
          data.title = value;
        }
      }
    },
    {
      title: '副标题',
      type: 'Text',
      options: {
        locale: true
      },
      value: {
        get({ data }: Result) {
          return data.subTitle;
        },
        set({ data }: Result, value: string) {
          data.subTitle = value;
        }
      }
    },
    {
      title: '状态',
      type: 'Select',
      options: [
        { label: '成功', value: 'success' },
        { label: '错误', value: 'error' },
        { label: '信息', value: 'info' },
        { label: '警告', value: 'warning' }
      ],
      value: {
        get({ data }: Result) {
          return data.status;
        },
        set({ data }: Result, value: Status) {
          data.status = value;
        }
      }
    }
  ]
};
