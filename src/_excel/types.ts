export type Sheet = {
  name?: string;
  header?: string[];
  columns?: Array<{
    width?: number;
    hidden?: boolean;
  } | undefined>
  additionalInfo?: {
    data: Array<string>,
    rowIndex: number
  } 
  data?: Array<Record<string, any>>;
};

export type DataSource = Array<Sheet>;

export interface Data {
  filename: string;
  useDynamicFilename: boolean;
}

export interface InputData {
  filename: string;
  dataSource: DataSource;
}

export enum InputIds {
  Filename = 'input.filename'
}
