export interface Data {
  picks: Array<PickType>,
  storageType: EnumStorage,
  runImmediate: boolean
}

export type PickType = {
  id: string,
  itemKey: string
}

export enum EnumStorage {
  SESSION = 'session',
  LOCAL = 'local'
}