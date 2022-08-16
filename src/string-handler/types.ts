export interface Data {
  resolveType: string;
  splitChar: string;
  joinChar: string;
  targetChar: string;
  replaceChar: string;
  isReplaceAll: boolean;
}
export enum ResolveType {
  SPLIT = 'split',
  JOIN = 'join',
  REPLACE = 'replace'
}
