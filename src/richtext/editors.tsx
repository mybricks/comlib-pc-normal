export default {
  ':root': [
    {
      title: '显示编辑栏',
      type: 'switch',
      value: {
        get({ data }) {
          return data.displayEditbar;
        },
        set({ data }, val: boolean) {
          // @ts-ignore
          data.displayEditbar = val;
        }
      }
    },
    {
      title: '插件选择',
      type: 'select',
      ifVisible({ data }) {
        return data.displayEditbar;
      },
      options() {
        return {
          options: [
            {
              label: '超链接',
              value: 'link'
            },
            {
              label: '表格',
              value: 'table'
            },
            {
              label: '图片上传',
              value: 'uploadimage'
            },
            // {
            //   label: '视频上传',
            //   value: 'uploadVideo',
            // },
            {
              label: '下划线',
              value: 'underline'
            },
            {
              label: '删除线',
              value: 'strikethrough'
            },
            {
              label: '加粗',
              value: 'bold'
            },
            {
              label: '左对齐',
              value: 'alignleft'
            },
            {
              label: '居中',
              value: 'aligncenter'
            },
            {
              label: '右对齐',
              value: 'alignright'
            },
            {
              label: '字体大小',
              value: 'fontsizeselect'
            },
            {
              label: '斜体',
              value: 'italic'
            },
            {
              label: '文本颜色',
              value: 'forecolor'
            },
            {
              label: '背景色',
              value: 'backcolor'
            }
          ],
          mode: 'multiple'
        };
      },
      value: {
        get({ data }) {
          return data.toolbar;
        },
        set({ data }, val: string[]) {
          // @ts-ignore
          data.toolbar = val;
        }
      }
    },
    {
      title: '样式',
      type: 'Style',
      options: {
        plugins: ['SIZE']
      },
      value: {
        get({ data }) {
          return { ...data.style, height: data.style.height || '200px' };
        },
        set({ data }, val: {}) {
          // @ts-ignore
          data.style = val || {};
        }
      }
    },
    {
      title: '事件',
      sameAs: 'shortcut',
      items: [
        {
          title: '编辑完成',
          type: '_Event',
          options: () => {
            return {
              outputId: 'done'
            };
          }
        },
        {
          title: '数据提交',
          type: '_Event',
          options: () => {
            return {
              outputId: 'submit'
            };
          }
        }
      ]
    }
  ]
};
