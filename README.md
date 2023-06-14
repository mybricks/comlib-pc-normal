# Mybricks-PC端通用组件库
<div align="center">
    <a href="https://mybricks.world/">
      <img src="https://user-images.githubusercontent.com/77093461/192469708-107ed96d-66d0-4eb2-861a-f97ac384ee15.png" height="300" width="300"/>
    </a>
</div>

## ✨ 特性
- 所见即所得的开发体验
- 通用无代码，通过图形化编排的方式可实现复杂的功能
- 方便且强大的即时调试能力

## ✨ 依赖的 Env 方法
```typeScript
// 引入连接器，仓库地址 https://github.com/mybricks/plugin-connector-http
import { call as callConnectorHttp } from '@mybricks/plugin-connector-http'

const env = {
  i18n (text: string) {
    // 多语言定制
    return text
  },
  callConnector (connector, params) {
    //调用连接器
    if (connector.type === 'http') {
      //服务接口类型
      return callConnectorHttp({ script: connector.script }, params)
    } else {
      return Promise.reject('错误的连接器类型.')
    }
  },
  vars: {
    getQuery: () => {
      // 返回页面路由参数
      return {}
    },
    get hasPermission() {
      return ({ key }) => {
        // TOD 操作权限校验
        return true
      })
    },
    get getRouter () {
      return () => {
        reload: () => {
          // TOD 刷新页面
        },
        redirect: ({ url }: { url: string }) => {
          // TOD 重定向
        },
        back: () => {
          // TOD 后退
        },
        forward: () => {
          // TOD 前进
        },
        pushState: ({
          state,
          title,
          url,
        }: {
          state: any;
          title: string;
          url: string;
        }) => {
           // TOD 路由跳转
        },
        openTab: ({ url, title }: { url: string; title: string }) => {
          // TOD 打开新标签页
        }
      }
    }
  }

}

```

## 🤝 社区互助
如果您在使用过程中碰到问题，可以加入Mybricks社区，获得产品与服务支持！  
<img width="121" src="https://user-images.githubusercontent.com/77093461/192530868-113b794a-0fa5-480e-b18b-50f12d83897b.png">

## ❤️ 贡献者
感谢所有为Mybricks做出贡献的伙伴们！
<div>
  <a href="https://github.com/GodStream">
    <img src="https://avatars.githubusercontent.com/u/23089466?s=64&amp;v=4" alt="@GodStream" border-radius="50%" size="32" height="32" width="32">
  </a>
  <a href="https://github.com/zzfzfz">
    <img src="https://avatars.githubusercontent.com/u/59550023?s=64&amp;v=4" alt="@zzfzfz" size="32" height="32" width="32">
  </a>
  <a href="https://github.com/z35635">
    <img src="https://avatars.githubusercontent.com/u/71205096?s=64&amp;v=4" alt="@z35635" size="32" height="32" width="32">
  </a>
  <a href="https://github.com/dawujiang">
    <img src="https://avatars.githubusercontent.com/u/17929180?s=64&amp;v=4" alt="@dawujiang" size="32" height="32" width="32">
  </a>
  <a href="https://github.com/Bigbig-Huang">
    <img src="https://avatars.githubusercontent.com/u/77093461?s=64&amp;v=4" alt="@Bigbig-Huang" size="32" height="32" width="32">
  </a>
</div>