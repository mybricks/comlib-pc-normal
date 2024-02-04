import * as qiankun from 'qiankun'

export interface MApp {
  name: string
  entry: string
  container: HTMLElement
  activeRule?: string
}

interface AppItem {
  [url: string]: MApp
}

class MainApp {
  apps: MApp[] = [] as MApp[]

  appsMap: AppItem = {}

  cacheHtmlMap = {}

  isHashMode = true

  curUrl = ''

  regist = ({ apps }: { apps: MApp[] }) => {
    this.apps = apps

    apps.forEach((app) => {
      this.appsMap[app.activeRule] = app
    })
  }

  start = () => {}

  goto = (url, title) => {
    this.curUrl = url
    const curApp = this.appsMap[this.curUrl]

    if (!curApp || !curApp.container || !curApp.entry) {
      console.warn('[micro app load fail] invalid app')
      return
    }

    const { entry, container } = curApp

    if (!this.cacheHtmlMap?.[entry]) {
      fetch(entry, {
        method: 'GET',
      })
        .then((res) => {
          if (res.headers.get('content-type') === 'text/plain') {
            return res.text()
          }
          return res.text()
        })
        .then((htmlString: string) => {
          this.cacheHtmlMap[entry] = htmlString
          this.renderHtmlByHtmlString(htmlString, container)
        })
    } else {
      this.renderHtmlByHtmlString(this.cacheHtmlMap[entry], container)
    }
  }

  loadApp = ({ entry, container }) => {
    if (!this.cacheHtmlMap?.[entry]) {
      const mount = () => {
        return fetch(entry, {
          method: 'GET',
        })
          .then((res) => {
            if (res.headers.get('content-type') === 'text/plain') {
              return res.text()
            }
            return res.text()
          })
          .then((htmlString: string) => {
            this.cacheHtmlMap[entry] = htmlString
            this.renderHtmlByHtmlString(htmlString, container)
          })
      }

      const mountPrmosie = mount()

      const unmount = () => Promise.resolve()

      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPrmosie,
        unmount,
      }
    } else {
      const mount = () => {
        this.renderHtmlByHtmlString(this.cacheHtmlMap[entry], container)
        return Promise.resolve()
      }

      const mountPrmosie = mount()
      const unmount = () => Promise.resolve()
      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPrmosie,
        unmount,
      }
    }
  }

  loadInvalidApp = ({ container }) => {
    const mount = () => {
      this.renderHtmlByHtmlString(
        `
        <body style="margin: 0px;">
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            font-style: italic;
            color: #999;
            font-weight: 400;
            font-size: 13px;
            height: 50px;
          ">当前页面未配置</div>
        </body>
        `,
        container
      )
      return Promise.resolve()
    }
    const mountPrmosie = mount()
    const unmount = () => Promise.resolve()
    return {
      getStatus: () => 'MOUNTED',
      mount,
      mountPrmosie,
      unmount,
    }
  }

  private renderHtmlByHtmlString = (
    htmlString: string,
    mountNode: HTMLElement
  ) => {
    if (mountNode) {
      const iframeEle = document.createElement('iframe')
      mountNode.innerHTML = ''
      mountNode.appendChild(iframeEle)

      htmlString = htmlString.replace('</head>', `
        <script>
          var parentHistory = window.parent.history;
          history.pushState = (...args) => {
            return parentHistory.pushState.apply(parentHistory, args)
          }
        </script>
        </head>
      `)
      window.iframeEle = iframeEle

      iframeEle.style =
        'width: 100%;height: 100%;border: 0px;border-radius: 0px;'

      iframeEle.contentWindow?.document.write(htmlString)
    }
  }
}

const mockMainApp = new MainApp()

// const openIframeMode = false
/** @description 设计器中 用iFrame渲染 */
const openIframeMode = () => {
  return !!document.querySelector('div[class^="lyStage-"]') ||
  !!new URL(location.href).searchParams.get('microIframeMode')
}

export const loadApp = ({ name, entry, container }) => {
  if (openIframeMode()) {
    return mockMainApp.loadApp({ entry, container })
  }
  return qiankun.loadMicroApp(
    { name, entry, container },
    { sandbox: true, singular: false }
  )
}

export const loadInvalidApp = ({ container }) => {
  return mockMainApp.loadInvalidApp({ container })
  // if (openIframeMode) {
  //   return mockMainApp.loadInvalidApp({ container })
  // }
  // return qiankun.loadMicroApp({ name: '__EMPTY__PAGE__', container, entry: {  html: EMPTY_HTML_STRING, styles: [] }  })
}

export class RouteManager {
  private _envType = location.pathname.startsWith('/runtime/mfs/staging') ? 'staging' : 'prod'
  private _rootPath = location.pathname.split('/').slice(0, this._envType === 'staging' ? 8 : 7).join('/')

  onRouteChange: (url: string) => void = (url) => {}

  init = ({ isHashMode = true, onRouteChange = (url: string) => {} } = {}) => {
  }

  getRootPath() {
    return this._rootPath
  }

  getCurrentRoute = () => {
    return location.pathname.split('/').slice(this._envType === 'staging' ? 8 : 7).join('/')
  }

  goto = (url) => {
    this.pushState(url)
  }

  replaceState(url = '') {
    history.replaceState(null, '', url ? `${this._rootPath}/${url}` : '')
  }

  pushState(url = '') {
    history.pushState(null, '', url)
  }
}
