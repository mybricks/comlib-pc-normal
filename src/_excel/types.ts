export type Sheet = {
  name: string;
  data: Array<Record<string, any>>;
};

export interface Data {
  filename: string
  dataSource: Array<Partial<Sheet>>;
}
