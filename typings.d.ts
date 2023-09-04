declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare module "*.svg" {
  const resource: any;
  export = resource;
}

interface Env {
  ajax: (url: string, opt: Record<string, any>) => Promise<any>
  events: any[]
  vars?: {
    getQuery: () => any;
    getExecuteEnv?: () => any;
    getProps: () => any;
    getCookies: () => any;
    getRouter: () => Record<string, Function>
  },
  hasPermission: ({ key:string }) => boolean
  /**
   * 通过权限ID获取对应的权限配置信息，TODO: 把 xxx 换成「无权限时」对应的字段
   * @param key 权限ID
   * @returns 权限配置信息
   */
  getPermissionInfo: ({ id:string }) => { id:string, type: string, register: { code:string, title:string, xxx:string } }
  [x: string]: any
}
interface RuntimeParams<T> {
  /** 组件ID **/
  id: string
  name: string
  data: T
  env: Env
  _env: any
  style: any
  slots: {
    [key: string]: {
      render: (props?: { wrap?: any, inputValues?: any, key?: number | string, style?: React.CSSProperties, outputs?: { [key: string]: Function } }) => React.ReactNode
      inputs: any
      [key: string]: any
    }
  }
  inputs: any
  outputs: any
  _inputs: any
  _outputs: any
  logger: any
  createPortal: any
  /** 父容器插槽 **/
  parentSlot: any
  title?: string
  onError: (params: Error | string) => null
}

interface EditorResult<T> {
  id: string
  name: string
  data: T
  focusArea: any
  output: any
  input: any
  inputs: any
  outputs: any
  slot: any,
  diagram: any
  style: React.CSSProperties
  catelog: any
  slots?: any
  env: Env
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
  setDesc: (desc?: string) => void
  /** 获取子组件data，引擎 v1.2.69 **/
  getChildByName: (name: string) => any
  removePermission: (id:string) => void;
}

interface UpgradeParams<T> {
  id: string
  data: T
  output: any
  input: any
  slot: any
  style: any
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
  setDeclaredStyle: (selector: string, style: React.CSSProperties) => void
  config: {
    get: (id: string) => ConfigInstance;
  }
  children: any
  /**
   * 注册权限信息
   * @param options 权限相关信息
   * @returns 注册后的权限ID
   */
  registerPermission: (options: { code: string; title: string }) => { id: string };
}

type ConfigInstance = {
  id: string;
  title: string;
  schema: Record<string, any>;
  connectionCount: number;
  setBinding: (binding: string) => void;
  setSchema: (schema: Record<string, any>) => void;
  setTitle: (title: string) => void;
  remove: () => void
}

type AnyMap = {
  [key in string | number]: any
}

type StyleModeType<T> = Partial<{
  title: string;
  initValue: CSSProperties;
  target: string | ((props: EditorResult<T>) => string) | undefined;
  domTarget: string;
  options: Array<string | { type: string; config: Record<string, any> }>;
}>;