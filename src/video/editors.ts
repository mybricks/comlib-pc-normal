import { CSSProperties } from 'react';
import { Data } from './types';

export default {
  '@init'({ data, style }) {
    // data.src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    style.width = '100%';
    style.height = 300;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({ data }, ...cate) {
      cate[0].title = '常规';
      cate[0].items = [
        {
          title: '属性',
          items: [
            {
              title: '视频链接',
              description: '目前只支持mp4，mov，hls，flv视频（流）格式',
              type: 'text',
              value: {
                get({ data }: RuntimeParams<Data>) {
                  return data.src;
                },
                set({ data }: RuntimeParams<Data>, value: string) {
                  data.src = value;
                }
              }
            },
            {
              title: '自动播放',
              type: 'Switch',
              value: {
                get({ data }: RuntimeParams<Data>) {
                  return data.autoplay;
                },
                set({ data }: RuntimeParams<Data>, val: boolean) {
                  data.autoplay = val;
                  data.muted = val;
                }
              }
            },
            {
              title: '控制栏',
              type: 'Switch',
              value: {
                get({ data }: RuntimeParams<Data>) {
                  return data.controls;
                },
                set({ data }: RuntimeParams<Data>, val: boolean) {
                  data.controls = val;
                }
              }
            },
            {
              title: '循环播放',
              type: 'Switch',
              value: {
                get({ data }: RuntimeParams<Data>) {
                  return data.loop;
                },
                set({ data }: RuntimeParams<Data>, val: boolean) {
                  data.loop = val;
                }
              }
            },
            {
              title: '封面',
              type: 'imageSelector',
              value: {
                get({ data }: RuntimeParams<Data>) {
                  return data.poster;
                },
                set({ data }: RuntimeParams<Data>, val: string) {
                  data.poster = val;
                }
              }
            },
            {
              title: '比例',
              type: 'select',
              options: {
                options: [
                  { label: '保持比例', value: 'contain' },
                  { label: '充满', value: 'fill' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.fit || 'contain';
                },
                set({ data }: EditorResult<Data>, val: CSSProperties['objectFit']) {
                  data.fit = val;
                }
              }
            }
          ]
        }
      ];
    },
    style: {
      options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
      target: ['[data-root="root"] > div', '[data-root="root"] > video']
    }
  }
};
