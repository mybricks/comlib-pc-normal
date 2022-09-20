declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

interface Env {
  ajax: (url: string, opt: Record<string, any>) => Promise<any>
  [x: string]: any
}
interface RuntimeParams<T> {
  data: T
  env: Env
  style: any
  slots: {
    [key: string]: {
      render: (props?: { wrap?: any, inputValues?: any, key?: number | string }) => React.ReactNode
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
  title?: string
  onError: (params: Error | string) => null
}

interface EditorResult<T> {
  data: T
  focusArea: any
  output: any
  input: any
  slot: any,
  diagram: any
  style: any
  catelog: any
  slots?: any
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
  setDesc: (desc?: string) => void
}

interface UpgradeParams<T> {
  data: T
  output: any
  input: any
  slot: any
  style: any
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
}

type AnyMap = {
  [key in string | number]: any
}

interface Env { preview?: {}, edit?: {}, runtime?: any, mock?: {} }