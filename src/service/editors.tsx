import { Data, IService } from './constants'

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { insideServiceContent } = data
  const info = []
  if (insideServiceContent && insideServiceContent.title) {
    info.push(`接口：${insideServiceContent.title}`)
  }
  setDesc(info.join('\n'))
}
export default {
  '@init': ({ data, setAutoRun, isAutoRun }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false
    if (autoRun || data.immediate) {
      setAutoRun(true)
      data.immediate = true
    }
  },
  ':root': [
    // {
    //   title: 'Mock请求',
    //   type: 'switch',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.isMock;
    //     },
    //     set({ data }: EditorResult<Data>, value: boolean) {
    //       data.isMock = value;
    //     }
    //   }
    // },
    // {
    //   title: '立即请求',
    //   type: 'switch',
    //   ifVisible({ isAutoRun }: EditorResult<Data>) {
    //     // 配置兼容
    //     // 在项目面板起点
    //     // 隐藏
    //     const autoRun = isAutoRun ? isAutoRun() : false;
    //     if (autoRun) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.immediate;
    //     },
    //     set({ data, setAutoRun }: EditorResult<Data>, value: boolean) {
    //       if (setAutoRun) {
    //         setAutoRun(value);
    //       }
    //       data.immediate = value;
    //     }
    //   }
    // },
    {
      title: '内部接口选择',
      type: 'insideService',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.insideServiceContent
        },
        set({ data, setDesc }: EditorResult<Data>, value: IService) {
          data.serviceType = 'inside'
          data.insideServiceContent = {
            id: value.id,
            title: value.content?.title,
          }
          setDescByData({ data, setDesc })
        },
      },
    },
  ],
}
