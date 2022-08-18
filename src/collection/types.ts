export interface Data {
  resolveType: string;
  sort: {
    type: 'up' | 'down';
    sortKey: string;
  };
  flat: {
    level: number;
  };
}
export enum ResolveType {
  SOME = 'some',
  EVERY = 'every',
  FIND = 'find',
  FILTER = 'filter',
  SORT = 'sort',
  FLAT = 'flat',
  UNIQUE = 'unique'
}
