export type DataSource = Array<File>;

export interface Data {
  titleIndex: number;
  fieldIndex: number
  dateNF?: string
}

export interface InputData {
  dataSource: DataSource;
}


export interface ParseFileData {
  filename: string;
  data: Array<{
    sheetName: string,
    headers?: string[]
    fields?: string[]
    json: any[][]
  }>
}