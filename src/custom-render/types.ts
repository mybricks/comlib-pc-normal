export type IOEvent = Partial<{
  _id: string;
  key: string;
  label: string;
}>;

export interface Data {
  props?: string;
  componentCode: string;
  events?: Array<IOEvent>;
  extraLib?: string
}
