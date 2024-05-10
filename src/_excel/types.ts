export type Sheet = {
  name: string;
  header?: string[];
  columns?: {
    width: number;
    hidden: boolean;
  }[];
  data: Array<Record<string, any>>;
};

export interface Data {
  filename: string;
  useDynamicFilename: boolean;
  dataSource: Array<Partial<Sheet>>;
}

export enum InputIds {
  Filename = 'input.filename'
}
