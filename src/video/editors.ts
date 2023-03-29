import { CSSProperties } from 'react';
import { Data } from './types';

export default {
  '@init'({ data, style }) {
    // data.src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    style.width = '100%';
    style.height = 300;
    data.style = {
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: "8px 8px 8px 8px",
    };
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root'({ data }, ...cate) {
    cate[0].title = '常规';
    cate[0].items = [
      {
        title: '属性',
        items: [
          {
            title: '动态视频链接',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return !!data.dynamicSrc;
              },
              set({ data, input }: EditorResult<Data>, val: boolean) {
                data.dynamicSrc = val;
                if (val) {
                  input.add('link', '设置视频链接', {
                    type: 'string'
                  });
                } else if (input.get('link')) {
                  input.remove('link');
                }
              }
            }
          },
          {
            title: '视频链接',
            description: '目前只支持mp4，mov，hls，flv视频（流）格式',
            type: 'text',
            ifVisible({ data }: EditorResult<Data>) {
              return !data.dynamicSrc;
            },
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
            title: '自定义封面',
            type: 'Switch',
            value: {
              get({ data }: RuntimeParams<Data>) {
                return data.usePoster;
              },
              set({ data }: RuntimeParams<Data>, val: boolean) {
                data.usePoster = val;
              }
            }
          },
          {
            title: '封面',
            type: 'imageSelector',
            ifVisible({ data }: RuntimeParams<Data>) {
              return data.usePoster;
            },
            value: {
              get({ data }: RuntimeParams<Data>) {
                return data.poster;
              },
              set({ data }: RuntimeParams<Data>, val: string) {
                data.poster = val;
              }
            }
          }
        ]
      },
      {
        title: '样式',
        items: [
          {
            title: '样式',
            type: 'Style',
            options: {
              plugins: ['border', 'bgcolor']
            },
            value: {
              get: ({ data }: EditorResult<Data>) => {
                return data.style;
              },
              set: ({ data }: EditorResult<Data>, value) => {
                console.log(value)
                data.style = value;
              }
            }
          },
          {
            title: '比例',
            type: 'select',
            options:{
              options: [
                {label: "保持比例", value: "contain"},
                {label: "充满", value: "fill"}
              ]
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.fit || 'contain';
              },
              set({ data }: EditorResult<Data>, val: CSSProperties['objectFit']) {
                  data.fit = val
              }
            }
          }
        ]
      }
    ];
  }
};
