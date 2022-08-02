export default {
  '@init'({style}) {
    style.width = 414;
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height'],
  },
  ':root'({data, output, style}, cate0, cate1, cate2) {
    cate0.title = '常规';
    cate0.items = [
      {
        items: [
          {
            title: '地址',
            type: 'imageSelector',
            value: {
              get({data}) {
                return data.src;
              },
              set({data}, src: string) {
                data.src = src;
              },
            },
          },
          {
            title: '样式',
            items: [
              {
                title: '样式',
                type: 'style',
                options: ['border'],
                value: {
                  get({data}) {
                    return data.imgStyle;
                  },
                  set({env, data}, val) {
                    data.imgStyle = {...data.imgStyle, ...val};
                  },
                },
              },
              {
                title: '图片填充方式',
                type: 'Select',
                options: [
                  {label: '拉伸', value: 'fill'},
                  {label: '铺满', value: 'cover'},
                  {label: '包含', value: 'contain'},
                ],
                value: {
                  get({data}) {
                    return data.imgStyle?.objectFit || 'fill';
                  },
                  set({data}, objectFit: string) {
                    if (!data.imgStyle) {
                      data.imgStyle = {objectFit};
                    } else {
                      data.imgStyle.objectFit = objectFit;
                    }
                  }
                }
              }
            ]
          },
          {
            title: '动作',
            items: [
              {
                title: '单击',
                type: '_event',
                options: {
                  outputId: 'click',
                },
              },
            ]
          }
        ]
      }
    ]
  },
};
